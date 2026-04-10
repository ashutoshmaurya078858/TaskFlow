import { PLANS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { FadeIn } from "./shared";

export function Pricing() {
  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-lg">
            Start free. Scale when you're ready. No surprise bills.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map(({ name, price, period, desc, cta, popular, features }, i) => (
            <FadeIn key={name} delay={i * 80}>
              <div className={cn(
                "relative rounded-2xl p-8 border transition-all",
                popular
                  ? "bg-gradient-to-b from-indigo-600 to-violet-700 border-transparent shadow-2xl shadow-indigo-200 scale-105"
                  : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50"
              )}>
                {popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                    Most popular
                  </div>
                )}
                <p className={cn("text-sm font-bold uppercase tracking-widest mb-1", popular ? "text-indigo-200" : "text-indigo-500")}>{name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={cn("text-4xl font-extrabold", popular ? "text-white" : "text-slate-900")}>{price}</span>
                  {price !== "Custom" && <span className={cn("text-xs mb-1.5", popular ? "text-indigo-200" : "text-slate-400")}>{period}</span>}
                </div>
                <p className={cn("text-xs mb-6 leading-relaxed", popular ? "text-indigo-200" : "text-slate-500")}>{desc}</p>

                <button className={cn(
                  "w-full py-2.5 rounded-xl text-sm font-semibold mb-7 transition-all",
                  popular
                    ? "bg-white text-indigo-600 hover:bg-indigo-50"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                )}>
                  {cta}
                </button>

                <ul className="space-y-3">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 className={cn("w-4 h-4 shrink-0", popular ? "text-indigo-200" : "text-indigo-500")} />
                      <span className={cn("text-xs", popular ? "text-indigo-100" : "text-slate-600")}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}