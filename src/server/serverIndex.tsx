import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { renderToString } from "react-dom/server"
import { apiRoute } from "./api/index"
import type { AppEnv } from "./env"

const app = new Hono()

app.route("/api", apiRoute)
app.use("/static/*", serveStatic({ root: "./" }))
app.use("/public/*", serveStatic({ root: "./" }))
app.get("*", (c) => {
    const faviconFilename = env<AppEnv>(c).FAVICON_FILENAME || "favicon-env-a.png"

    return c.html(
        renderToString(
            <html lang="ja">
                <head>
                    <meta charSet="utf-8" />
                    <meta content="width=device-width, initial-scale=1" name="viewport" />
                    <link rel="icon" type="image/png" href={`/public/${faviconFilename}`} />

                    {/* sample css */}
                    <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css" />

                    {import.meta.env.PROD ? (
                        <script type="module" src="/static/client.js" />
                    ) : (
                        <script type="module" src="/src/client/clientIndex.tsx" />
                    )}
                </head>
                <body>
                    {/** biome-ignore lint/correctness/useUniqueElementIds: <> */}
                    <div id="root" />
                </body>
            </html>
        )
    )
})

export default app

if (import.meta.env.PROD) {
    serve(
        {
            fetch: app.fetch,
            port: process.env.PORT ? parseInt(process.env.PORT) : 3000
        },
        (info) => {
            console.log(`Server running at http://${info.address}:${info.port}`)
        }
    )
}
