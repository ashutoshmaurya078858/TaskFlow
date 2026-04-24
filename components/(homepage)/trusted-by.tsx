"use client"
import { TRUSTED } from "@/lib/data";

export function TrustedBy() {
  return (
    <section className="py-14 bg-white border-y border-slate-100" id="trusted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em]">
            Trusted by teams at
          </p>
          {/* Scrolling marquee container */}
          <div className="relative w-full overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="flex items-center gap-14 animate-[marquee_20s_linear_infinite] w-max">
              {[...TRUSTED, ...TRUSTED].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="text-slate-300 font-bold text-base tracking-tight hover:text-slate-500 transition-colors cursor-default select-none whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}