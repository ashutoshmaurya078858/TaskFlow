import { TRUSTED } from "@/lib/data";

export function TrustedBy() {
  return (
    <section
      className="py-14 bg-white border-y border-slate-100 overflow-hidden"
      id="trusted"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-8">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Trusted by engineering teams at
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-[marquee_30s_linear_infinite] w-max gap-14 items-center">
          {[...TRUSTED, ...TRUSTED].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-slate-300 font-bold text-lg tracking-tight hover:text-slate-600 transition-colors cursor-default select-none whitespace-nowrap px-2"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}