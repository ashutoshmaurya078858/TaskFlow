import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "../../(auth)/server/server";
import members from "@/fetures/members/server/route";
import emailRoutes from "@/fetures/email/server/route";
import workspaces from "@/fetures/workspace/server/route";
import projects from "@/fetures/projects/server/route";
import tasks from "@/fetures/tasks/server/route";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)
  .route("/members", members)
  .route("/email", emailRoutes)
  .route("/projects", projects)
  .route("/tasks", tasks);

  
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
