"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveModal } from "@/components/(dashboard)/responsive-model";
import { TaskStatus } from "../types";
import { useCreateTask } from "../hookes/use-create-task";
import { useGetProjects } from "@/fetures/projects/api/use-get-projects";

const formSchema = z.object({
  name:        z.string().trim().min(1, "Task name is required"),
  status:      z.nativeEnum(TaskStatus),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId:   z.string().trim().min(1, "Required"),
  assigneeId:  z.string().trim().min(1, "Required"),
  dueDate:     z.string().min(1, "Due date is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  projectId?: string;
  members?: { $id: string; name: string }[];
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: TaskStatus.TODO,        label: "To Do"       },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.IN_REVIEW,   label: "In Review"   },
  { value: TaskStatus.DONE,        label: "Done"        },
  { value: TaskStatus.BACKLOG,     label: "Backlog"     },
];

const SELECT =
  "w-full rounded-lg border border-gray-300 bg-gray-50 h-11 px-3 text-sm text-gray-900 " +
  "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none disabled:opacity-50";

// Always-visible, styled scrollbar via inline CSS injected once
const SCROLLBAR_STYLE = `
  .task-modal-scroll::-webkit-scrollbar        { width: 6px; }
  .task-modal-scroll::-webkit-scrollbar-track  { background: #f1f5f9; border-radius: 999px; }
  .task-modal-scroll::-webkit-scrollbar-thumb  { background: #cbd5e1; border-radius: 999px; }
  .task-modal-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  .task-modal-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
`;

export function CreateTaskModal({
  open,
  onOpenChange,
  workspaceId,
  projectId,
  members = [],
}: CreateTaskModalProps) {
  const { mutate, isPending } = useCreateTask();
  const { data: projectsData } = useGetProjects({ workspaceId });

  const getDefaults = React.useCallback(
    (): FormValues => ({
      name:        "",
      workspaceId,
      projectId:   projectId ?? "",
      assigneeId:  "",
      status:      TaskStatus.TODO,
      description: "",
      dueDate:     "",
    }),
    [workspaceId, projectId],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaults(),
  });

  React.useEffect(() => {
    if (open) reset(getDefaults());
  }, [open, reset, getDefaults]);

  const onSubmit: SubmitHandler<FormValues> = ({ dueDate, ...rest }) => {
    mutate(
      { ...rest, dueDate: new Date(dueDate) },
      {
        onSuccess: () => {
          reset(getDefaults());
          onOpenChange(false);
        },
      },
    );
  };

  function handleOpenChange(val: boolean) {
    if (!val) reset(getDefaults());
    onOpenChange(val);
  }

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange} title="Create Task">
      {/* Inject scrollbar styles once */}
      <style dangerouslySetInnerHTML={{ __html: SCROLLBAR_STYLE }} />

      {/* Modal shell — white, capped height, flex column */}
      <div className="flex flex-col max-h-[85vh] bg-white rounded-xl overflow-hidden">

        {/* ── Sticky header ─────────────────────────────────── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">New Task</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Fill in the details to create a new task.
          </p>
        </div>

        {/* ── Scrollable body ───────────────────────────────── */}
        <div
          className="task-modal-scroll flex-1 overflow-y-scroll px-6 py-5 bg-white"
          style={{ scrollbarGutter: "stable" }}
        >
          <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Task Name */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                Task Name <span className="text-red-400">*</span>
              </Label>
              <Input
                disabled={isPending}
                placeholder="e.g. Fix login bug"
                className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 h-11 text-gray-900 placeholder-gray-400"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                Status <span className="text-red-400">*</span>
              </Label>
              <select disabled={isPending} className={SELECT} {...register("status")}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs font-medium">{errors.status.message}</p>
              )}
            </div>

            {/* Project */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                Project <span className="text-red-400">*</span>
              </Label>
              <select disabled={isPending} className={SELECT} {...register("projectId")}>
                <option value="">Select a project</option>
                {projectsData?.documents?.map((p) => (
                  <option key={p.$id} value={p.$id}>{p.name}</option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-red-500 text-xs font-medium">{errors.projectId.message}</p>
              )}
            </div>

            {/* Assignee */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                Assignee <span className="text-red-400">*</span>
              </Label>
              <select disabled={isPending} className={SELECT} {...register("assigneeId")}>
                <option value="">Select an assignee</option>
                {members.map((m) => (
                  <option key={m.$id} value={m.$id}>{m.name}</option>
                ))}
              </select>
              {errors.assigneeId && (
                <p className="text-red-500 text-xs font-medium">{errors.assigneeId.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                Due Date <span className="text-red-400">*</span>
              </Label>
              <Input
                type="date"
                disabled={isPending}
                className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 h-11 text-gray-900"
                {...register("dueDate")}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs font-medium">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                Description
              </Label>
              <textarea
                disabled={isPending}
                placeholder="Add a description..."
                rows={3}
                className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none disabled:opacity-50"
                {...register("description")}
              />
            </div>

          </form>
        </div>

        {/* ── Sticky footer ─────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3 bg-white">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-300 h-11 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-task-form"
            disabled={isPending}
            className="flex-1 bg-indigo-600 h-11 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}