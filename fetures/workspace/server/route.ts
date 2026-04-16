import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/section-meddleware";
import { BUCKETID, DATABASE_ID, MEMBER_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/fetures/Members/types";
import { generateInviteCode } from "@/lib/utils";
import { getmember } from "@/fetures/Members/utils";
import z from "zod";
import { workspace } from "../typs";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    // 1. Query the MEMBERS collection, not the WORKSPACES collection
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBER_ID, // <-- FIX: This was previously WORKSPACES_ID
      [Query.equal("userId", user.$id)],
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
        Query.equal("$id", workspaceIds), // <-- FIX: Changed from Query.contains
      ],
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
          inviteCode: generateInviteCode(7),
        },
      );
      await databases.createDocument(DATABASE_ID, MEMBER_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    },
  )
  .patch(
    "/:workspace",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");
      const { workspace } = c.req.param();

      // 1. Authorize the user
      const member = await getmember({
        databases: databases,
        userId: user.$id,
        workspaceId: workspace,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401); // Fixed typo: Unauthorized
      }

      // 2. Handle the optional image update
      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        // If a new file is uploaded, store it and get the URL
        const file = await storage.createFile(BUCKETID, ID.unique(), image);
        uploadedImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${BUCKETID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT}`;
      } else if (image === "") {
        // Optional: handle clearing the image if the user removes it on the frontend
        uploadedImageUrl = "";
      }

      // 3. Construct the payload dynamically
      // We only want to update fields that were actually provided
      const updatePayload: Record<string, any> = {};

      if (name) {
        updatePayload.name = name;
      }
      if (uploadedImageUrl !== undefined) {
        updatePayload.imageUrl = uploadedImageUrl;
      }

      // 4. Update the workspace document in Appwrite
      const updatedWorkspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspace, // The document ID from the route param
        updatePayload,
      );

      // 5. Return the updated workspace
      return c.json({ data: updatedWorkspace });
    },
  )
  .delete("/:workspace", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspace } = c.req.param();

    // 1. Authorize the user
    const member = await getmember({
      databases: databases,
      userId: user.$id,
      workspaceId: workspace,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401); // Fixed typo: Unauthorized
    }

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspace);
    return c.json({ data: { $id: workspace } });
  })

  .post("/:workspace/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspace } = c.req.param();

    // 1. Authorize the user
    const member = await getmember({
      databases: databases,
      userId: user.$id,
      workspaceId: workspace,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401); // Fixed typo: Unauthorized
    }

    const workspaces = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspace,
      {
        inviteCode: generateInviteCode(7),
      },
    );
    return c.json({ data: workspaces });
  })
  .post(
    "/:workspace/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspace } = c.req.param();
      const { code } = c.req.valid("json");

      // 1. Authorize the user
      const member = await getmember({
        databases: databases,
        userId: user.$id,
        workspaceId: workspace,
      });
      if (member) {
        return c.json({ error: "Already a member" }, 400);
      }
      const workspaces = await databases.updateDocument<workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspace,
      );

      if (workspaces.inviteCode !== code) {
        return c.json({ error: "Invilad code" }, 400);
      }

      await databases.createDocument(DATABASE_ID, MEMBER_ID, ID.unique(), {
        workspaceId: workspace,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });
      return c.json({ data: workspaces });
    },
  );

export default app;
