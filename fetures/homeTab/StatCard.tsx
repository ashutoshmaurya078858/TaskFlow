import { CheckCircle2, Clock, AlertCircle, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkspaceStats {
  total:      number;
  done:       number;
  inProgress: number;
  overdue:    number;
}

interface StatCardProps {
  label:  string;
  value:  number;
  icon:   React.ReactNode;
  accent: string;
  sub?:   string;
}

function StatCard({ label, value, icon, accent, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
        <span className={cn("p-2 rounded-xl", accent)}>{icon}</span>
      </div>
      <div>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

interface HomeStatCardsProps {
  stats: WorkspaceStats;
}

export function HomeStatCards({ stats }: HomeStatCardsProps) {
  const completionRate =
    stats.total > 0 ? `${Math.round((stats.done / stats.total) * 100)}% completion rate` : undefined;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total tasks"
        value={stats.total}
        icon={<CircleDashed className="size-4 text-gray-500" />}
        accent="bg-gray-100"
        sub="across all projects"
      />
      <StatCard
        label="Completed"
        value={stats.done}
        icon={<CheckCircle2 className="size-4 text-green-600" />}
        accent="bg-green-50"
        sub={completionRate}
      />
      <StatCard
        label="In progress"
        value={stats.inProgress}
        icon={<Clock className="size-4 text-blue-600" />}
        accent="bg-blue-50"
        sub="actively being worked"
      />
      <StatCard
        label="Overdue"
        value={stats.overdue}
        icon={<AlertCircle className="size-4 text-red-500" />}
        accent="bg-red-50"
        sub={stats.overdue === 0 ? "Nothing overdue!" : "need attention"}
      />
    </div>
  );
}