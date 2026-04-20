import { BUCKETID, DATABASE_ID, PROJECT_ID, WORKSPACES_ID } from "@/config";
import { getmember } from "@/fetures/members/utils";
import { sessionMiddleware } from "@/lib/section-meddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import z from "zod";
import { createProjectSchema } from "../schema";

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
 .post(
  "/",
  zValidator("form", createProjectSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");
    const { name, image, workspaceId } = c.req.valid("form");

    // 1. Verify membership
    const member = await getmember({
      databases,
      workspaceId,
      userId: user.$id,
    });
    
    if (!member) {
      // FIX: Corrected "rerror" typo and added 401 status code
      return c.json({ error: "Unauthorized" }, 401);
    }

    let uploadedImageUrl: string | undefined;

    // 2. Upload image if provided
    if (image instanceof File) {
      const file = await storage.createFile(BUCKETID, ID.unique(), image);
      uploadedImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKETID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT}`;
    }

    // 3. Save the Project to the database
    const project = await databases.createDocument(
      DATABASE_ID,
      PROJECT_ID,
      ID.unique(),
      {
        name,
        imageUrl: uploadedImageUrl,
        workspaceId,
      },
    );

    return c.json({ data: project });
  },
);

export default app;
