import z from "zod";
import { TaskStatus } from "./types";

export const createTaskSchemas = z.object({
  name: z.string().min(1, "Required"),
  status: z.nativeEnum(TaskStatus),
  workspaceId: z.string().trim().min(1, "Required"),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  dueDate: z.coerce.date(),
});
