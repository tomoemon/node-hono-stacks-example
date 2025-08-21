import { vValidator } from "@hono/valibot-validator"
import { Hono } from "hono"
import { object, string } from "valibot"

export const apiApp = new Hono()

const route = apiApp
    .get("/clock", (c) => {
        return c.json({
            time: new Date().toLocaleTimeString()
        })
    })
    .get(
        "/hello",
        vValidator(
            "query",
            object({
                name: string()
            })
        ),
        (c) => {
            const { name } = c.req.valid("query")
            return c.json({
                message: `Hello! ${name}`
            })
        }
    )

export type HonoApiRoute = typeof route
