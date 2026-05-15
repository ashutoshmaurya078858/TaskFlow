import { STEPS } from "@/lib/data";
import { FadeIn } from "./shared";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold uppercase tracking-widest mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
      {children}
    </span>
  );
}

export function HowItWorks() {
  return (
    <section
      className="py-28 bg-white relative overflow-hidden"
      id="how-it-works"
    >
      {/* Radial tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eef2ff_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <FadeIn className="text-center mb-20">
          <SectionLabel>Dead simple</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Up and running{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              in minutes
            </span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Horizontal connector line (desktop only) */}
          <div
            className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, #c7d2fe 10%, #c7d2fe 90%, transparent)",
            }}
          />

          {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
            <FadeIn key={step} delay={i * 90}>
              <div className="relative text-center group">
                {/* Step number badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center z-10 shadow-md shadow-indigo-200">
                  {i + 1}
                </div>

                {/* Icon box */}
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-indigo-100 group-hover:border-indigo-300 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-50/60 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-indigo-100/80 group-hover:-translate-y-1.5">
                  <Icon className="w-8 h-8 text-indigo-600" />
                </div>

                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                  {step}
                </p>
                <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}