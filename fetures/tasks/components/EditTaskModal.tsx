"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveModal } from "@/components/(dashboard)/responsive-model";

import { Task, TaskStatus } from "../types";
import { useUpdateTask } from "../hookes/use-update-task";
import { useGetProjects } from "@/fetures/projects/api/use-get-projects";

// The schema is the same as create, but we omit workspaceId since it's inferred on the backend
const formSchema = z.object({
  name:        z.string().trim().min(1, "Task name is required"),
  status:      z.nativeEnum(TaskStatus),
  projectId:   z.string().trim().min(1, "Required"),
  assigneeId:  z.string().trim().min(1, "Required"),
  dueDate:     z.string().min(1, "Due date is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
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

const SCROLLBAR_STYLE = `
  .task-modal-scroll::-webkit-scrollbar        { width: 6px; }
  .task-modal-scroll::-webkit-scrollbar-track  { background: #f1f5f9; border-radius: 999px; }
  .task-modal-scroll::-webkit-scrollbar-thumb  { background: #cbd5e1; border-radius: 999px; }
  .task-modal-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  .task-modal-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
`;

export function EditTaskModal({
  open,
  onOpenChange,
  task,
  members = [],
}: EditTaskModalProps) {
  const { mutate, isPending } = useUpdateTask();
  
  // Assuming task has a workspaceId attached to it
  const { data: projectsData } = useGetProjects({ workspaceId: task?.workspaceId ?? "" });

  const getDefaults = React.useCallback(
    (): FormValues => ({
      name:        task?.name ?? "",
      projectId:   task?.projectId ?? "",
      assigneeId:  task?.assigneeId ?? "",
      status:      (task?.status as TaskStatus) ?? TaskStatus.TODO,
      description: task?.description ?? "",
      // Convert ISO date to YYYY-MM-DD for the HTML date input
      dueDate:     task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
    }),
    [task]
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

  // Reset form with new defaults whenever the modal opens or the selected task changes
  React.useEffect(() => {
    if (open) reset(getDefaults());
  }, [open, reset, getDefaults]);

  const onSubmit: SubmitHandler<FormValues> = ({ dueDate, ...rest }) => {
    if (!task) return;

    mutate(
      { 
        param: { taskId: task.$id }, 
        json: { ...rest, dueDate: new Date(dueDate) } 
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  function handleOpenChange(val: boolean) {
    if (!val) reset(getDefaults());
    onOpenChange(val);
  }

  if (!task) return null;

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange} title="Edit Task">
      <style dangerouslySetInnerHTML={{ __html: SCROLLBAR_STYLE }} />

      <div className="flex flex-col max-h-[85vh] bg-white rounded-xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Edit Task</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Update the details for "{task.name}".
          </p>
        </div>

        <div className="task-modal-scroll flex-1 overflow-y-scroll px-6 py-5 bg-white" style={{ scrollbarGutter: "stable" }}>
          <form id="edit-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-gray-600 font-medium uppercase text-xs tracking-wide">
                Status <span className="text-red-400">*</span>
              </Label>
              <select disabled={isPending} className={SELECT} {...register("status")}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.status && <p className="text-red-500 text-xs font-medium">{errors.status.message}</p>}
            </div>

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
              {errors.projectId && <p className="text-red-500 text-xs font-medium">{errors.projectId.message}</p>}
            </div>

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
              {errors.assigneeId && <p className="text-red-500 text-xs font-medium">{errors.assigneeId.message}</p>}
            </div>

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
              {errors.dueDate && <p className="text-red-500 text-xs font-medium">{errors.dueDate.message}</p>}
            </div>

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
            form="edit-task-form"
            disabled={isPending}
            className="flex-1 bg-indigo-600 h-11 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}