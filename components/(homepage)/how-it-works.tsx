import { STEPS } from "@/lib/data";
import { FadeIn } from "./shared";

export function HowItWorks() {
  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Dead simple</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Up and running in minutes
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
            <FadeIn key={step} delay={i * 80}>
              <div className="relative text-center px-4">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-[calc(50%+28px)] right-[-calc(50%-28px)] h-px bg-gradient-to-r from-indigo-200 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center mx-auto mb-5 shadow-md shadow-indigo-50">
                  <Icon className="w-7 h-7 text-indigo-600" />
                </div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">{step}</p>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}