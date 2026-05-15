"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VIEWS } from "@/lib/data";
import { FadeIn } from "./shared";
import { KanbanMock, ListMock, TimelineMock } from "./mocks";
import { Zap } from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-[11px] font-bold uppercase tracking-widest mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
      {children}
    </span>
  );
}

export function ProductPreview() {
  const [activeView, setActiveView] = useState("kanban");

  return (
    <section
      className="py-28 bg-slate-950 relative overflow-hidden"
      id="product"
    >
      {/* Atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-violet-600/10 blur-[80px] rounded-full" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Product preview</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 leading-[1.1]">
            Three views,{" "}
            <span className="text-indigo-400">one truth</span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-lg leading-relaxed">
            Switch between Kanban, List, and Timeline without losing context.
          </p>
        </FadeIn>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-900/80 border border-slate-800 rounded-2xl p-1.5 gap-1 backdrop-blur-sm">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  activeView === v.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/60"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <FadeIn>
          {/* Browser chrome */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/60">
            {/* Title bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex-1 bg-slate-800 rounded-lg h-6 flex items-center px-3 max-w-xs mx-auto">
                <span className="text-[11px] text-slate-500 font-mono">
                  app.flowtask.io/workspace
                </span>
              </div>
              <div className="w-16" />
            </div>

            {/* Preview content */}
            <div className="bg-white p-6 min-h-[400px]">
              {activeView === "kanban" && <KanbanMock />}
              {activeView === "list" && <ListMock />}
              {activeView === "timeline" && <TimelineMock />}
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5 flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            {VIEWS.find((v) => v.id === activeView)?.desc}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}