import { FEATURES } from "@/lib/data";
import { FadeIn } from "./shared";

export function Features() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">
            Everything you need
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Built for how teams
            <br />
            actually work
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-lg">
            Stop juggling tools. FlowTask unifies planning, tracking and
            shipping in one place.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 60}>
              <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-violet-50/0 group-hover:from-indigo-50/60 group-hover:to-violet-50/40 transition-all" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
