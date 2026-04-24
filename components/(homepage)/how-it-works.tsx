import { STEPS } from "@/lib/data";
import { FadeIn } from "./shared";

export function HowItWorks() {
  return (
    <section className="py-28 bg-slate-50 overflow-hidden" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <FadeIn className="text-center mb-20">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-[0.2em] mb-4">
            Dead simple
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
            Up and running{" "}
            <span className="text-slate-400">in minutes</span>
          </h2>
        </FadeIn>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

          {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
            <FadeIn key={step} delay={i * 80}>
              <div className="relative flex flex-col items-center text-center">
                {/* Step number pill */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-white border border-indigo-100 text-indigo-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm shadow-indigo-50 uppercase tracking-widest">
                    {step}
                  </span>
                </div>

                {/* Icon circle */}
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-md shadow-slate-100 flex items-center justify-center mb-6 group-hover:border-indigo-200 transition-colors">
                  <Icon className="w-7 h-7 text-indigo-500" />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light">
                  {desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}