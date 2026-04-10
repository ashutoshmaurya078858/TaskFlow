"use client";

import { useState, useEffect } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserButton } from "@/fetures/auth/components/user-button";
type Props = {
  user: any;
};
export function Navbar({user}:Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV_LINKS = ["Features", "Pricing", "About"];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            FlowTask
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user?<UserButton/>:<Link
            href="/sign-in"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5"
          >
            Log in
          </Link>}
          <button className="text-sm font-semibold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity shadow-md shadow-indigo-200">
             <Link href={user?"/dashboard":"/sign-in"} className="cursor-pointer">
             {user?"Open Console": "Get Started"}
             </Link>
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="block text-sm font-medium text-slate-700 py-1.5"
            >
              {l}
            </a>
          ))}
         {user?

          <UserButton/>: <Link
            href="/sign-in"
            className="block text-sm text-slate-700"
          >
            Log in
          </Link>}
          <button className="w-full mt-2 text-sm font-semibold text-white px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600">
           <Link href={user?"/dashboard":"/sign-in"} className="cursor-pointer">
            {user?"Open Console": "Get Started"}
            </Link>
          </button>
        </div>
      )}
    </header>
  );
}
