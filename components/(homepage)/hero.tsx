import { Sparkles, MoveRight, Play, ArrowRight } from "lucide-react";
import { CountUp, FadeIn } from "./shared";
import { KanbanMock } from "./mocks";

export function Hero() {
  return (
    <section className="relative pt-28 pb-0 overflow-hidden bg-white">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Soft radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-100/60 via-violet-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <FadeIn>
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 text-indigo-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 shadow-sm shadow-indigo-50">
            <Sparkles className="w-3 h-3" />
            AI-powered sprint suggestions — now live
            <span className="w-1 h-1 rounded-full bg-indigo-300" />
            <span className="text-indigo-400 font-normal">New</span>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={80}>
          <h1 className="text-5xl sm:text-6xl md:text-[72px] font-extrabold text-slate-900 tracking-[-0.03em] leading-[1.04] mb-5">
            Ship projects{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                without the chaos
              </span>
              {/* Underline accent */}
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-400/50 via-violet-400/50 to-transparent rounded-full" />
            </span>
          </h1>
        </FadeIn>

        {/* Subheadline */}
        <FadeIn delay={160}>
          <p className="max-w-xl mx-auto text-lg text-slate-400 leading-relaxed mb-10 font-light">
            FlowTask unifies sprint planning, issue tracking, and team
            collaboration — so you can focus on building, not managing.
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={240}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button className="group relative flex items-center gap-2 bg-slate-900 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Start for free
              <MoveRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="flex items-center gap-2 text-slate-500 font-medium text-sm px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:text-slate-700 transition-all bg-white/80">
              <Play className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
              Watch 90s demo
            </button>
          </div>
        </FadeIn>

        {/* Social proof numbers */}
        <FadeIn delay={300}>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mb-14 text-center">
            {[
              { n: 10000, s: "+", label: "teams worldwide" },
              { n: 4.9, s: "/5", label: "average rating" },
              { n: 99, s: "%", label: "uptime SLA" },
            ].map(({ n, s, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">
                  {label === "average rating" ? (
                    <>{n}{s}</>
                  ) : (
                    <CountUp end={n as number} suffix={s} />
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
            <div className="hidden sm:block w-px h-8 bg-slate-100" />
            <div className="flex -space-x-2">
              {["bg-indigo-400", "bg-violet-400", "bg-purple-400", "bg-pink-400"].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white`} />
              ))}
              <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500">
                +9k
              </div>
            </div>
          </div>
        </FadeIn>

        {/* App screenshot */}
        <FadeIn delay={400}>
          <div className="relative mx-auto max-w-5xl">
            {/* Fade bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white z-10 pointer-events-none" style={{ top: "65%" }} />
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-gradient-to-b from-indigo-100/30 to-transparent rounded-3xl blur-2xl -z-10" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-200 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/80 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-3 bg-white rounded-md px-3 py-1 text-[11px] text-slate-400 border border-slate-200 flex items-center gap-1.5 max-w-[280px]">
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  app.flowtask.io/workspace/my-project
                </div>
              </div>
              <div className="p-5">
                <KanbanMock />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}