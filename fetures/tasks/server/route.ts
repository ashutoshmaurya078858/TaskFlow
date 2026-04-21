import { sessionMiddleware } from "@/lib/section-meddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchemas } from "../schemas";
import { getmember } from "@/fetures/members/utils";
import { DATABASE_ID, MEMBER_ID, PROJECT_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import z from "zod";
import { TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { project } from "@/fetures/projects/typs";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      }),
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId, assigneeId, dueDate, projectId, search, status } =
        c.req.valid("query");

      const member = await getmember({
        databases,
        userId: user.$id,
        workspaceId,
      });
      if (!member) {
        return c.json({ error: "unauthorzed" }, 401);
      }
      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        console.log("projectId", projectId);
        query.push(Query.equal("projectId", projectId));
      }

      if (status) {
        console.log("status", status);
        query.push(Query.equal("status", status));
      }

      if (assigneeId) {
        console.log("assigneeId", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        console.log("dueDate", dueDate);
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        console.log("search", search);
        query.push(Query.search("search", search));
      }

      const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, query);

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<project>(
        DATABASE_ID,
        PROJECT_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBER_ID, // ← correct
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
      );
      const assignees = await Promise.all(
        members.documents.map(async (membe) => {
          const user = await users.get(membe.userId);
          return {
            ...membe,
            name: user.name,
            email: user.email,
          };
        }),
      );

      const populatedTask = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId,
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId,
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        data: {
          ...tasks,
          documents: populatedTask,
        },
      });
    },
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchemas),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const {
        assigneeId,
        dueDate,
        name,
        status,
        workspaceId,
        description,
        projectId,
      } = c.req.valid("json");
      const member = await getmember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "unauthorzed" }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ],
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID, // <-- THIS was PROJECT_ID, causing the error
        ID.unique(),
        {
          name,
          status,
          dueDate,
          assigneeId,
          description,
          workspaceId,
          projectId,
          position: newPosition,
        },
      );
      return c.json({ data: task });
    },
  )

  // 👇 NEW UPDATE (PATCH) ROUTE 👇
  .patch(
    "/:taskId",
    sessionMiddleware,
    // Note: Assuming you have an updateTaskSchemas, or using .partial() if createTaskSchemas is a Zod object
    zValidator("json", createTaskSchemas.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();
      const updates = c.req.valid("json");

      // 1. Fetch the existing task to get the workspaceId
      const existingTask = await databases.getDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
      );

      // 2. Verify authorization
      const member = await getmember({
        databases,
        userId: user.$id,
        workspaceId: existingTask.workspaceId,
      });

      if (!member) {
        return c.json({ error: "unauthorized" }, 401);
      }

      // 3. Perform the update
      const updatedTask = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        updates,
      );

      return c.json({ data: updatedTask });
    },
  )
  // 👇 NEW DELETE ROUTE 👇
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    // 1. Fetch the existing task to get the workspaceId
    const existingTask = await databases.getDocument(
      DATABASE_ID,
      TASKS_ID,
      taskId,
    );

    // 2. Verify authorization
    const member = await getmember({
      databases,
      userId: user.$id,
      workspaceId: existingTask.workspaceId,
    });

    if (!member) {
      return c.json({ error: "unauthorized" }, 401);
    }

    // 3. Delete the task
    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    // Return the ID of the deleted task so the frontend can remove it from state
    return c.json({ data: { $id: taskId } });
  });

export default app;
