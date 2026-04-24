// components/tasks/TaskRowSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TaskRowSkeleton() {
  return (
    <div className="relative overflow-hidden flex items-center gap-4 px-4 py-4 border-b border-gray-50 group">
      {/* Sweeping Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />

      {/* Task Name & Desc */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-[40%] bg-gray-200 rounded" />
        <Skeleton className="h-3 w-[25%] bg-gray-100 rounded" />
      </div>

      {/* Status */}
      <div className="hidden md:block w-24">
        <Skeleton className="h-6 w-20 rounded-full bg-gray-100" />
      </div>

      {/* Assignee */}
      <div className="hidden sm:flex items-center gap-2 w-32">
        <Skeleton className="size-7 rounded-full bg-gray-200 shrink-0" />
        <Skeleton className="h-3 w-16 bg-gray-100 rounded" />
      </div>

      {/* Project */}
      <div className="hidden lg:block w-28">
        <Skeleton className="h-4 w-20 bg-gray-100 rounded" />
      </div>

      {/* Due Date */}
      <div className="w-24">
        <Skeleton className="h-4 w-20 bg-gray-100 rounded" />
      </div>

      {/* Actions */}
      <div className="w-8">
        <Skeleton className="size-8 rounded-md bg-gray-50" />
      </div>
    </div>
  );
}