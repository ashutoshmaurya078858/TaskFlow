"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip"; 
import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import { DashNav } from "./dasnav";

interface DashboardShellProps {
  children: React.ReactNode;
  user: any; // Removed currentTab
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        {/* Removed currentTab prop here */}
        <AppSidebar user={user} />

        <SidebarInset>
          <header
            className={cn(
              "sticky top-0 z-20 flex h-14 items-center gap-3",
              "bg-background/80 backdrop-blur-md border-border transition-colors duration-200"
            )}
          > 
            <DashNav user={user} />
          </header>

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-background transition-colors duration-200">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}