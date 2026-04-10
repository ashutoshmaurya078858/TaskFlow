import { INTEGRATIONS } from "@/lib/data";
import { FadeIn } from "./shared";

export function Integrations() {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100" id="integrations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Integrations</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Works with your stack
          </h2>
          <p className="max-w-lg mx-auto text-slate-500 text-lg mb-14">
            Connect the tools you already love. 250+ integrations available on day one.
          </p>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 max-w-3xl mx-auto">
            {INTEGRATIONS.map(({ name, icon: Icon, color }) => (
              <div key={name} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:shadow-md group-hover:border-slate-300 transition-all">
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}