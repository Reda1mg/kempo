import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";


export function getApp() {
    const app = new OpenAPIHono() ;
    app.use(cors())
    return app
}