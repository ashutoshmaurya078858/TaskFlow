"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VIEWS } from "@/lib/data";
import { FadeIn } from "./shared";
import { KanbanMock, ListMock, TimelineMock } from "./mocks";

export function ProductPreview() {
  const [activeView, setActiveView] = useState("kanban");
  const activeDesc = VIEWS.find((v) => v.id === activeView)?.desc;

  return (
    <section className="py-28 bg-white overflow-hidden" id="product">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <FadeIn className="text-center mb-14">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-[0.2em] mb-4">
            Product preview
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-5">
            Three views,{" "}
            <span className="text-slate-400">one truth</span>
          </h2>
          <p className="max-w-md mx-auto text-slate-400 text-lg font-light leading-relaxed">
            Switch between Kanban, List, and Timeline without losing context or
            having to re-sync.
          </p>
        </FadeIn>

        {/* View tabs — more refined pill style */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-100 rounded-xl p-1 gap-0.5">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-semibold transition-all",
                  activeView === v.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview window */}
        <FadeIn>
          <div className="relative">
            {/* Decorative blur behind */}
            <div className="absolute -inset-6 bg-gradient-to-b from-indigo-50/50 to-violet-50/30 rounded-3xl blur-3xl -z-10" />

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex items-center gap-2 ml-2">
                  <div className="h-5 w-48 bg-slate-100 rounded-md" />
                </div>
                <div className="flex items-center gap-1.5">
                  {VIEWS.map((v) => (
                    <span
                      key={v.id}
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-md transition-all",
                        activeView === v.id
                          ? "bg-indigo-100 text-indigo-600"
                          : "text-slate-300"
                      )}
                    >
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 min-h-[320px]">
                {activeView === "kanban" && <KanbanMock />}
                {activeView === "list" && <ListMock />}
                {activeView === "timeline" && <TimelineMock />}
              </div>
            </div>
          </div>

          {/* Description */}
          {activeDesc && (
            <p className="text-center text-sm text-slate-400 mt-5 font-light">
              {activeDesc}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}