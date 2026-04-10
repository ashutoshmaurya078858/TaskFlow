import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/section-meddleware";
import { BUCKETID, DATABASE_ID, MEMBER_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/fetures/Members/types";
import { generateInviteCode } from "@/lib/utils";

const app = new Hono()
 .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    // 1. Query the MEMBERS collection, not the WORKSPACES collection
    const members = await databases.listDocuments(
      DATABASE_ID, 
      MEMBER_ID, // <-- FIX: This was previously WORKSPACES_ID
      [Query.equal("userId", user.$id)]
    );

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    // 2. Query the actual workspaces using the extracted IDs
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [
        Query.orderDesc("$createdAt"), 
        Query.equal("$id", workspaceIds) // <-- FIX: Changed from Query.contains
      ]
    );

    return c.json({ data: workspaces });
})
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        // 1. Upload the original file to Appwrite Storage
        const file = await storage.createFile(BUCKETID, ID.unique(), image);
        uploadedImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKETID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT}`;
      }

      // 3. Save the Workspace with the URL pointing to the Storage bucket
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode:generateInviteCode(7)
        },
      );
      await databases.createDocument(DATABASE_ID, MEMBER_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    },
  );

export default app;
