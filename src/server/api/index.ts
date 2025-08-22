import { vValidator } from "@hono/valibot-validator"
import { Hono } from "hono"
import { hc } from "hono/client"
import { object, string } from "valibot"

export const apiRoute = new Hono()
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

export type ApiType = typeof apiRoute
export const apiClient = hc<ApiType>("/api")
