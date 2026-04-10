"use client";

import { useState, useEffect } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserButton } from "@/fetures/auth/components/user-button"; // Check your typo in 'features' if necessary!
import { useSidebar } from "@/components/ui/sidebar";

type Props = {
  user: any;
};

export function DashNav({ user }: Props) {
  const { toggleSidebar, state, isMobile } = useSidebar();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm border-slate-200",
      )}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-14">
        {/* EXACTLY ONE BUTTON ON THE LEFT: The Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "group flex items-center justify-center w-9 h-9 rounded-md border transition-all duration-200",
            "border-slate-200 bg-slate-50 text-slate-600",
            "hover:bg-slate-100 hover:border-slate-300 hover:text-slate-900",
            "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-1",
          )}
          aria-label="Toggle Sidebar"
        >
          <PanelLeftClose className="w-4 h-4 group-hover:scale-105 transition-transform" />
        </button>

        {/* EXACTLY ONE BUTTON ON THE RIGHT: The User Button (or Login) */}
        <div>
          {user ? (
            <UserButton />
          ) : (
            <Link
              href="/sign-in"
              className={cn(
                "text-sm font-medium text-slate-700 px-4 py-1.5 rounded-lg border border-slate-300",
                "hover:bg-slate-100 hover:border-slate-400 hover:text-slate-900",
                "transition-all duration-200",
              )}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
