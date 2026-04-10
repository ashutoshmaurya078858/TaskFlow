"use client";

import * as React from "react";
import Link from "next/link";
import {
  Zap,
  Search,
  Plus,
  Circle,
  ChevronsUpDown,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { NAV_ITEMS, PROJECTS } from "@/lib/dashboard";
import { WorkspaceSwitcher } from "./workspace-swicher";

interface AppSidebarProps {
  currentTab: string;
  user: any;
}

export function AppSidebar({ currentTab, user }: AppSidebarProps) {
  console.log(user)
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const initials = React.useMemo(() => {
    const name: string = user?.name ?? "John Doe";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <Sidebar
      collapsible="icon"
      className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                {/* Added group-data-[collapsible=icon]:hidden here 👇 */}
                <span className="text-lg font-bold text-slate-900 tracking-tight group-data-[collapsible=icon]:hidden">
                  FlowTask
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <WorkspaceSwitcher />
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_ITEMS.map(({ title, id, icon: Icon, badge }) => {
              const isActive = currentTab === id;
              return (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={title}
                    className={cn(
                      "border-l-2 transition-all duration-150",
                      isActive
                        ? "border-l-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        : "border-l-transparent",
                    )}
                  >
                    <Link href={`/dashboard?tab=${id}`} scroll={false}>
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive
                            ? "text-violet-600 dark:text-violet-400"
                            : "text-sidebar-foreground/50",
                        )}
                      />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {badge && (
                    <SidebarMenuBadge className="bg-violet-500/15 text-violet-600 dark:text-violet-400 font-bold text-[10px]">
                      {badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction title="Add project">
            <Plus className="h-3.5 w-3.5" />
          </SidebarGroupAction>
          <SidebarMenu>
            {PROJECTS.map(({ name, color, icon: Icon, progress }) => (
              <SidebarMenuItem key={name}>
                <SidebarMenuButton
                  tooltip={`${name} · ${progress}%`}
                  className="hover:bg-sidebar-accent transition-colors duration-150"
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                  <span className="flex-1 truncate">{name}</span>
                  <span
                    className="ml-auto shrink-0 text-[10px] font-semibold group-data-[collapsible=icon]:hidden"
                    style={{ color }}
                  >
                    {progress}%
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                  tooltip="Account"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-xs font-semibold">
                      {user?.name ?? "John Doe"}
                    </span>
                    <span className="truncate text-[10px] text-sidebar-foreground/50">
                      {user?.email ?? "john@example.com"}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
                    <ChevronsUpDown className="h-3.5 w-3.5 text-sidebar-foreground/40" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-48 rounded-xl"
              >
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex justify-end px-2 pb-1 group-data-[collapsible=icon]:justify-center">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
