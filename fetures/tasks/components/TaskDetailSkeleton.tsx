function TaskDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      {/* NO shimmer overlay div */}

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <div className="animate-shimmer h-3.5 w-16 rounded-md" />
        <div className="animate-shimmer h-3 w-2 rounded" />
        <div className="animate-shimmer h-3.5 w-20 rounded-md" />
        <div className="animate-shimmer h-3 w-2 rounded" />
        <div className="animate-shimmer h-3.5 w-28 rounded-md" />
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="animate-shimmer h-4 w-10 rounded-md" />
          <div className="animate-shimmer h-7 w-16 rounded-lg" />
        </div>
        <div className="h-px w-full bg-gray-50" />
        <div className="space-y-2 pt-1">
          <div className="animate-shimmer h-6 w-2/3 rounded-md" />
          <div className="animate-shimmer h-6 w-2/5 rounded-md" />
        </div>
        <div className="animate-shimmer h-7 w-24 rounded-lg" />
      </div>

      {/* Details card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        <div className="px-6 py-4">
          <div className="animate-shimmer h-2.5 w-12 rounded" />
        </div>
        {[
          { label: "w-14", value: "w-24" },
          { label: "w-14", value: "w-40" },
          { label: "w-16", value: "w-32" },
          { label: "w-16", value: "w-28" },
          { label: "w-14", value: "w-48" },
        ].map((item, i) => (
          <div key={i} className="px-6 py-3.5 flex items-center gap-4">
            <div className="flex items-center gap-2 w-32 shrink-0">
              <div className="animate-shimmer h-3.5 w-3.5 rounded shrink-0" />
              <div className={`animate-shimmer h-3.5 rounded ${item.label}`} />
            </div>
            <div className={`animate-shimmer h-4 rounded ${item.value}`} />
          </div>
        ))}
      </div>

      {/* Description card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="animate-shimmer h-3.5 w-3.5 rounded shrink-0" />
            <div className="animate-shimmer h-2.5 w-20 rounded" />
          </div>
          <div className="animate-shimmer h-6 w-8 rounded-md" />
        </div>
        <div className="space-y-2.5 pt-1">
          <div className="animate-shimmer h-3.5 w-full rounded" />
          <div className="animate-shimmer h-3.5 w-[88%] rounded" />
          <div className="animate-shimmer h-3.5 w-[76%] rounded" />
          <div className="animate-shimmer h-3.5 w-[60%] rounded" />
        </div>
      </div>
    </div>
  );
}

export default TaskDetailSkeleton;