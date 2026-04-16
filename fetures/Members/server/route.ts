import { sessionMiddleware } from "@/lib/section-meddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Client, Query, Users } from "node-appwrite"; // 1. Import 'Users' instead of 'Account'
import z from "zod";
import { getmember } from "../utils";
import { DATABASE_ID, MEMBER_ID } from "@/config";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APP_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

      // 2. Initialize the Server SDK's Users service
      const users = new Users(client);

      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      // Check if the current user is a member
      const member = await getmember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Fetch all member records for this workspace
      const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      // 3. Fix the map syntax and user lookup logic
      const populateMembers = await Promise.all(
        members.documents.map(async (memberDoc) => {
          // Make sure 'userId' matches the exact attribute name in your Appwrite collection
          const memberUser = await users.get(memberDoc.userId);

          return {
            ...memberDoc,
            name: memberUser.name,
            email: memberUser.email,
          };
        }),
      );

      // 4. Return the populated data to the client
      return c.json({
        data: {
          ...members,
          populateMembers,
        },
      });
    },
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const memberId = c.req.param("memberId");

    // 1. Fetch the member record that is trying to be deleted
    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBER_ID,
      memberId,
    );

    if (!memberToDelete) {
      return c.json({ error: "Member not found" }, 404);
    }

    // 2. Fetch the CURRENT user's membership in that same workspace
    const currentUserMember = await getmember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!currentUserMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // 3. Authorization logic (Crucial Step)
    // Check if the current user is an ADMIN, or if they are deleting themselves (leaving)
    const isSelf = currentUserMember.$id === memberId;
    const isAdmin = currentUserMember.role === "ADMIN"; // Adjust 'role' based on your Appwrite schema

    if (!isSelf && !isAdmin) {
      return c.json(
        {
          error:
            "Unauthorized: You do not have permission to remove this member",
        },
        403,
      );
    }

    // 4. Perform the deletion
    await databases.deleteDocument(DATABASE_ID, MEMBER_ID, memberId);

    return c.json({ data: { $id: memberId } });
  })
  
  .patch(
    "/:memberId",
    sessionMiddleware,
    // Validate the incoming JSON body to only accept specific roles
    zValidator("json", z.object({ role: z.enum(["ADMIN", "MEMBER"]) })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const memberId = c.req.param("memberId");
      const { role } = c.req.valid("json");

      // 1. Fetch the member record we want to update
      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBER_ID,
        memberId
      );

      if (!memberToUpdate) {
        return c.json({ error: "Member not found" }, 404);
      }

      // 2. Fetch the CURRENT user's membership to check permissions
      const currentUserMember = await getmember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!currentUserMember) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // 3. Authorization logic: Only an ADMIN can change roles
      if (currentUserMember.role !== "ADMIN") {
        return c.json({ error: "Unauthorized: Only admins can change roles" }, 403);
      }

      // 4. Optional but recommended: Prevent an admin from downgrading themselves
      // if they are the only admin left, or just prevent them from changing their own role.
      if (currentUserMember.$id === memberId && role === "MEMBER") {
        return c.json({ error: "Cannot downgrade your own role" }, 400);
      }

      // 5. Update the member's role in the database
      const updatedMember = await databases.updateDocument(
        DATABASE_ID,
        MEMBER_ID,
        memberId,
        {
          role,
        }
      );

      return c.json({ data: updatedMember });
    }
  );

export default app;
