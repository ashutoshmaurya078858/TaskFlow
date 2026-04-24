import { FEATURES } from "@/lib/data";
import { FadeIn } from "./shared";

export function Features() {
  return (
    <section className="py-28 bg-slate-950" id="features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <FadeIn className="mb-16 max-w-xl">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.2em] mb-4">
            Everything you need
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.08] mb-5">
            Built for how teams
            <br />
            <span className="text-slate-400">actually work</span>
          </h2>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            Stop juggling tools. FlowTask unifies planning, tracking, and
            shipping in one place.
          </p>
        </FadeIn>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-800">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 60}>
              <div className="group bg-slate-950 p-7 hover:bg-slate-900 transition-colors cursor-pointer h-full flex flex-col gap-5">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                    {desc}
                  </p>
                </div>
                {/* Subtle arrow on hover */}
                <div className="mt-auto pt-2">
                  <span className="text-[11px] text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium flex items-center gap-1">
                    Learn more
                    <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}