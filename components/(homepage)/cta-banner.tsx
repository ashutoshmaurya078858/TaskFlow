import { ArrowRight } from "lucide-react";
import { FadeIn } from "./shared";

export function CTABanner() {
  return (
    <section id="about" className="py-28 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4">Ready to ship faster?</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Start building today.<br />Free forever.
          </h2>
          <p className="text-indigo-200 text-lg mb-10">
            No credit card required. Set up your first project in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group flex items-center gap-2 bg-white text-indigo-700 font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl">
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="text-sm font-semibold text-indigo-200 hover:text-white border border-indigo-400 hover:border-indigo-200 px-8 py-3.5 rounded-xl transition-colors">
              Talk to sales
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}