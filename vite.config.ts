import path from "node:path"
import { fileURLToPath } from "node:url"
import devServer from "@hono/vite-dev-server"
import adapter from "@hono/vite-dev-server/node"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import { defineConfig } from "vite"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commonPathResolve = {
    alias: {
        "@": path.resolve(__dirname, "./src")
    }
}

const tanstack = tanstackRouter({
    routesDirectory: "src/client/routes",
    generatedRouteTree: "src/client/routeTree.gen.ts"
})

export default defineConfig(({ mode }) => {
    if (mode === "client") {
        return {
            resolve: commonPathResolve,
            plugins: [tanstack],
            build: {
                rollupOptions: {
                    input: "./src/client/clientIndex.tsx",
                    output: {
                        entryFileNames: "static/client.js",
                        // TanStackRouter lazy load assets
                        chunkFileNames: "static/[name]-[hash].js"
                    }
                }
            }
        }
    } else if (mode === "server") {
        return {
            resolve: commonPathResolve,
            build: {
                ssr: true,
                minify: true,
                outDir: "dist",
                emptyOutDir: false,
                rollupOptions: {
                    input: "./src/server/serverIndex.tsx",
                    output: {
                        entryFileNames: "index.js"
                    }
                }
            }
        }
    } else {
        // dev server
        return {
            build: {
                rollupOptions: {
                    input: "./src/client/clientIndex.tsx"
                }
            },
            resolve: commonPathResolve,
            plugins: [
                tanstack,
                devServer({
                    adapter,
                    entry: "./src/server/serverIndex.tsx"
                })
            ]
        }
    }
})
