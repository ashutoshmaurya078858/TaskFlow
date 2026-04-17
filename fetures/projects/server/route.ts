import { DATABASE_ID, PROJECT_ID } from "@/config";
import { getmember } from "@/fetures/members/utils";
import { sessionMiddleware } from "@/lib/section-meddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import z from "zod";

const app = new Hono()
.get(
  "/",
  zValidator("query", z.object({ workspaceId: z.string() })),
  sessionMiddleware,
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    
    // zValidator guarantees workspaceId exists here!
    const { workspaceId } = c.req.valid("query"); 

    const member = await getmember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECT_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ]);

    return c.json({ data: projects });
  },
)


export default app;