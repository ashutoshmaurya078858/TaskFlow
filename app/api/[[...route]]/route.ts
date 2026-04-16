import { Hono } from 'hono'
import {handle} from 'hono/vercel'
import auth from "../../(auth)/server/server"
import workspaces from "@/fetures/workspace/server/route"
import members from "@/fetures/members/server/route"


const app = new Hono().basePath("/api")



const routes = app.route("/auth",auth).route("/workspaces",workspaces).route("/members",members)
export const GET =handle(app)
export const POST =handle(app)
export const PATCH =handle(app)
export const DELETE =handle(app)


export type AppType = typeof routes