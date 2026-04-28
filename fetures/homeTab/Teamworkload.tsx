import { TrendingUp } from "lucide-react";
import { SectionHeader } from "./MyTasksList";

export interface MemberWorkload {
  id:    string;
  name:  string;
  count: number;
  done:  number;
}

interface MemberRowProps {
  member: MemberWorkload;
}

function MemberRow({ member }: MemberRowProps) {
  const { name, count, done } = member;
  const pct = count === 0 ? 0 : Math.round((done / count) * 100);
const initials = (name ?? "?")
  .split(" ")
  .map((w) => w[0] ?? "")
  .slice(0, 2)
  .join("")
  .toUpperCase() || "?";

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0">
        {initials}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 truncate">{name}</span>
          <span className="text-xs text-gray-400 shrink-0 ml-2">{done}/{count}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

interface TeamWorkloadProps {
  members:   MemberWorkload[];
  isLoading: boolean;
}

export function TeamWorkload({ members, isLoading }: TeamWorkloadProps) {
  if (!isLoading && members.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <SectionHeader
        icon={<TrendingUp className="size-3.5" />}
        title="Team workload"
      />

      {isLoading ? (
        <WorkloadSkeleton />
      ) : (
        <div className="divide-y divide-gray-50">
          {members.map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkloadSkeleton() {
  return (
    <div className="space-y-4 py-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 rounded bg-gray-100 animate-pulse" />
            <div className="h-1.5 w-full rounded-full bg-gray-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}