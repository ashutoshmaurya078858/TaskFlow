"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronsUpDown, Circle, Plus, Sparkles } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { NAV_ITEMS } from "@/lib/dashboard";
import { WorkspaceSwitcher } from "./workspace-swicher";
import Project from "@/fetures/projects/components/project";
import { CreateProjectModal } from "@/fetures/projects/components/project-model";
import { useGetMyTasks } from "@/fetures/tasks/api/use-getmy-task";

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params.workspace as string;

  /**
   * Optimization: Fetch tasks using the user's email or a "me" flag 
   * if your API supports it, avoiding the need to fetch the full members list.
   * If your API strictly requires memberId, ensure your `user` object 
   * includes it to prevent an extra API hop.
   */
  const { data: myTasksData, isLoading: isLoadingTasks } = useGetMyTasks({
    workspaceId,
    // Assuming your API can handle email-based filtering or 
    // that 'user' prop is hydrated with the correct ID.
    assigneeId: user?.email, 
  });

  const myTaskCount = myTasksData?.documents?.length ?? 0;

  const initials = React.useMemo(() => {
    return (user?.name ?? "JD")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  return (
    <>
      <CreateProjectModal
        workspaceId={workspaceId}
        open={open}
        onOpenChange={setOpen}
      />
      <Sidebar
        collapsible="icon"
        className="bg-white/90 backdrop-blur-md shadow-sm border-r border-slate-100"
      >
        <SidebarHeader className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900 tracking-tight group-data-[collapsible=icon]:hidden">
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
            <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">
              Menu
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1 px-2">
              {NAV_ITEMS.map(({ title, id, icon: Icon }) => {
                const href = id === "home" 
                  ? `/dashboard/workspace/${workspaceId}`
                  : id === "my-tasks"
                  ? `/dashboard/workspace/${workspaceId}/my-tasks`
                  : `/dashboard/${workspaceId}/${id}`;

                const isActive = pathname === href;

                return (
                  <SidebarMenuItem key={id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={title}
                      className={cn(
                        "rounded-lg px-3 py-2 transition-all duration-200",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <Link href={href}>
                        <Icon className={cn("h-4 w-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                        <span>{title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {id === "my-tasks" && (
                      <SidebarMenuBadge className="group-data-[collapsible=icon]:hidden">
                        {isLoadingTasks ? (
                          <Skeleton className="h-4 w-5 bg-slate-200" />
                        ) : (
                          myTaskCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                              {myTaskCount}
                            </span>
                          )
                        )}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <div className="flex items-center justify-between px-4 mb-2 group-data-[collapsible=icon]:hidden">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                Projects
              </span>
              <button
                onClick={() => setOpen(true)}
                className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <SidebarMenu className="px-2">
              <Project />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-sm">
                      {initials}
                    </div>
                    <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate text-xs font-bold text-slate-900">
                        {user.name}
                      </span>
                      <span className="truncate text-[10px] text-slate-400">
                        {user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56 rounded-xl shadow-xl border-slate-100">
                  <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer py-2.5">Billing</DropdownMenuItem>
                  <SidebarSeparator />
                  <DropdownMenuItem className="gap-2 cursor-pointer py-2.5 text-red-600 focus:text-red-600 focus:bg-red-50">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="mt-2 flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <ThemeToggle />
            <div className="flex items-center gap-1.5 group-data-[collapsible=icon]:hidden">
               <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 animate-pulse" />
               <span className="text-[10px] font-medium text-slate-400">Online</span>
            </div>
          </div>
        </SidebarFooter> */}
      </Sidebar>
    </>
  );
}