"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VIEWS } from "@/lib/data";
import { FadeIn } from "./shared";
import { KanbanMock, ListMock, TimelineMock } from "./mocks";


export function ProductPreview() {
  const [activeView, setActiveView] = useState("kanban");

  return (
    <section className="py-24 bg-slate-50" id="product">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-12">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">Product preview</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Three views, one truth
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-lg">
            Switch between Kanban, List, and Timeline without losing context.
          </p>
        </FadeIn>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
            {VIEWS.map(v => (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-semibold transition-all",
                  activeView === v.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <FadeIn>
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200 overflow-hidden p-6">
            {activeView === "kanban"   && <KanbanMock />}
            {activeView === "list"     && <ListMock />}
            {activeView === "timeline" && <TimelineMock />}
          </div>
          <p className="text-center text-sm text-slate-500 mt-4">
            {VIEWS.find(v => v.id === activeView)?.desc}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}