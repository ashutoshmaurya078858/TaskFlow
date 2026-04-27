import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"; // Ensure you have this utility

function TaskDetailSkeleton() {
  return (
    /* Added animate-pulse and a slight fade-in for the whole container */
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5 animate-in fade-in duration-500">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3 w-2" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3 w-2" />
        <Skeleton className="h-3.5 w-28" />
      </div>

      {/* ── Header card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>

        <Skeleton className="h-px w-full" />

        <div className="space-y-2 pt-1">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-2/5" />
        </div>

        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>

      {/* ── Details card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        <div className="px-6 py-4">
          <Skeleton className="h-2.5 w-12" />
        </div>

        {[
          { label: "w-14", value: "w-24" },
          { label: "w-14", value: "w-40" },
          { label: "w-18", value: "w-32" },
          { label: "w-16", value: "w-28" },
          { label: "w-14", value: "w-48" },
        ].map((item, i) => (
          <div key={i} className="px-6 py-3.5 flex items-center gap-4">
            <div className="flex items-center gap-2 w-32 shrink-0">
              <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
              <Skeleton className={cn("h-3.5", item.label)} />
            </div>
            <Skeleton className={cn("h-4", item.value)} />
          </div>
        ))}
      </div>

      {/* ── Description card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
            <Skeleton className="h-2.5 w-20" />
          </div>
          <Skeleton className="h-6 w-8 rounded-md" />
        </div>

        <div className="space-y-2.5 pt-1">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-[88%]" />
          <Skeleton className="h-3.5 w-[76%]" />
          <Skeleton className="h-3.5 w-[60%]" />
        </div>
      </div>

    </div>
  );
}

export default TaskDetailSkeleton;