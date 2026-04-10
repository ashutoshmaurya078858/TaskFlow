import { Sparkles, ChevronRight, MoveRight, Play } from "lucide-react";
import { CountUp, FadeIn } from "./shared";
import { KanbanMock } from "./mocks";


export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-50 via-violet-50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-violet-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Now with AI-powered sprint suggestions
            <ChevronRight className="w-3 h-3" />
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
            Manage projects{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              faster & smarter
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={160}>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-500 leading-relaxed mb-10">
            FlowTask brings sprint planning, issue tracking, and real-time collaboration into one
            beautiful workspace. Ship more, stress less.
          </p>
        </FadeIn>

        <FadeIn delay={240}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:opacity-95 transition-all">
              Get started free
              <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm px-7 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Play className="w-4 h-4 text-indigo-500" />
              Book a demo
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={320}>
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 mb-14">
            {[
              { n: 10000, s: "+", label: "Teams worldwide" },
              { n: 4.9,   s: "/5", label: "Avg rating" },
              { n: 99,    s: "% uptime", label: "SLA guaranteed" },
            ].map(({ n, s, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {label === "Avg rating" ? <>{n}{s}</> : <CountUp end={n as number} suffix={s} />}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={400}>
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10 pointer-events-none" style={{ top: "70%" }} />
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-[11px] text-slate-400 border border-slate-200">
                  app.flowtask.io/board/my-project
                </div>
              </div>
              <div className="p-4">
                <KanbanMock />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}