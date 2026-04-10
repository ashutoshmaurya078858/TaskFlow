import { TRUSTED } from "@/lib/data";

export function TrustedBy() {
  return (
    <section className="py-16 bg-slate-50 border-y border-slate-100" id="trusted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
          Trusted by 10,000+ teams worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {TRUSTED.map(name => (
            <span key={name} className="text-slate-300 font-bold text-lg tracking-tight hover:text-slate-500 transition-colors cursor-default select-none">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}