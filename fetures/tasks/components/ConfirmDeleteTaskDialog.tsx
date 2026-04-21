"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import { ResponsiveModal } from "@/components/(dashboard)/responsive-model";
import { Button } from "@/components/ui/button";

import { Task } from "../types";
import { useDeleteTask } from "../hookes/use-delete-task";

interface ConfirmDeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function ConfirmDeleteTaskDialog({
  open,
  onOpenChange,
  task,
}: ConfirmDeleteTaskDialogProps) {
  const { mutate, isPending } = useDeleteTask();

  const handleDelete = () => {
    if (!task) return;

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  // Prevent rendering if no task is selected
  if (!task) return null;

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} title="Delete Task">
      <div className="flex flex-col max-h-[85vh] bg-white rounded-xl overflow-hidden">
        
        {/* Modal Body */}
        <div className="px-6 pt-8 pb-6 bg-white">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Delete Task?</h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
                Are you sure you want to delete the task{" "}
                <span className="font-semibold text-gray-800">"{task.name}"</span>? 
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="flex-1 border-gray-300 h-11 text-gray-700 hover:bg-gray-100 rounded-lg text-sm bg-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 bg-red-600 h-11 hover:bg-red-500 text-white font-semibold rounded-lg text-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Task"
            )}
          </Button>
        </div>

      </div>
    </ResponsiveModal>
  );
}