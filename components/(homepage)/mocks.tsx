import { VIEWS, PRIORITY_COLOR, STATUS_COLOR } from "@/lib/data";
import { Badge } from "./shared";

export function KanbanMock() {
  const view = VIEWS[0];
  return (
    <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl min-h-[220px]">
      {view.cols?.map((col, ci) => (
        <div key={col} className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1">{col}</p>
          {view.cards?.filter(c => c.col === ci).map((card, i) => (
            <div key={i} className="bg-white rounded-lg p-2.5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-xs font-medium text-slate-800 leading-snug mb-2">{card.title}</p>
              <div className="flex items-center gap-1.5">
                <Badge label={card.tag} className="bg-indigo-50 text-indigo-600" />
                <Badge label={card.priority} className={PRIORITY_COLOR[card.priority]} />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ListMock() {
  const view = VIEWS[1];
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-[1fr_120px_80px_40px] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        {["Task", "Status", "Priority", ""].map(h => (
          <p key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{h}</p>
        ))}
      </div>
      {view.items?.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_120px_80px_40px] gap-3 px-4 py-2.5 items-center border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
          <p className="text-xs font-medium text-slate-700 truncate">{item.title}</p>
          <Badge label={item.status} className={STATUS_COLOR[item.status]} />
          <Badge label={item.priority} className={PRIORITY_COLOR[item.priority.toLowerCase()]} />
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#6366f1" }}>{item.assignee}</div>
        </div>
      ))}
    </div>
  );
}

export function TimelineMock() {
  const view = VIEWS[2];
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden p-4 space-y-3">
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex-1 text-center text-[9px] text-slate-300 font-medium">W{i + 1}</div>
        ))}
      </div>
      {view.bars?.map((bar, i) => (
        <div key={i} className="flex items-center gap-3">
          <p className="text-[11px] text-slate-500 w-32 shrink-0 truncate">{bar.task}</p>
          <div className="flex-1 relative h-6 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 h-full rounded-full flex items-center px-2"
              style={{ left: `${bar.start}%`, width: `${bar.width}%`, background: bar.color + "30", border: `1.5px solid ${bar.color}50` }}
            >
              <span className="text-[9px] font-semibold truncate" style={{ color: bar.color }}>{bar.task}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}