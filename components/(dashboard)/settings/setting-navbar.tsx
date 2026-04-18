"use client";

import { useState, useEffect } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserButton } from "@/fetures/auth/components/user-button";

type Props = {
  user: any;
};

export function SettingNavbar({ user }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const NAV_LINKS = ["Features", "Pricing", "About"];

  // Handle smooth scroll and offset for fixed navbar
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    linkName: string,
  ) => {
    e.preventDefault();
    const targetId = linkName.toLowerCase();
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Get the element's position and subtract the navbar height (approx 64px / h-16)
      const offsetTop =
        targetElement.getBoundingClientRect().top + window.scrollY - 64;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }

    // Close mobile menu after clicking a link
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-transparent",
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
        <nav className="hidden md:flex items-center gap-7"></nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <UserButton />
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
