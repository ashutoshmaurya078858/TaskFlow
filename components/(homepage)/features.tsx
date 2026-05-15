import { FEATURES } from "@/lib/data";
import { FadeIn } from "./shared";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold uppercase tracking-widest mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
      {children}
    </span>
  );
}

export function Features() {
  return (
    <section className="py-28 bg-white relative overflow-hidden" id="features">
      {/* Soft top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-50/70 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <FadeIn className="text-center mb-16">
          <SectionLabel>Everything you need</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-[1.1]">
            Built for how teams{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              actually work
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-lg leading-relaxed">
            Stop juggling tools. FlowTask unifies planning, tracking and
            shipping in one place.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 70}>
              <div className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/80 transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col">
                {/* Corner glow on hover */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative flex flex-col flex-1">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/50 group-hover:from-indigo-100 group-hover:to-violet-100 flex items-center justify-center mb-5 transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed flex-1">
                    {desc}
                  </p>
                </div>

                {/* Bottom sweep accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl" />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}