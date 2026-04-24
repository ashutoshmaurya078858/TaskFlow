"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Circle,
  Plus,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
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

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { NAV_ITEMS } from "@/lib/dashboard";
import { WorkspaceSwitcher } from "./workspace-swicher";
import Project from "@/fetures/projects/components/project";
import { CreateProjectModal } from "@/fetures/projects/components/project-model";
import { useGetMembers } from "@/fetures/members/api/use-get-members";
import { useCurrent } from "@/app/(auth)/api/use-corrent";
import { useGetMyTasks } from "@/fetures/tasks/api/use-getmy-task";

interface AppSidebarProps {
  user: any;
}

interface Member {
  $id: string;
  name: string;
  email: string;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const pathname = usePathname();
  const params = useParams();

  const { data: currentUser } = useCurrent();
  const workspaceId = params.workspace as string;

  // Resolve current user's member ID
  const { data: membersData } = useGetMembers({ workspaceId });
  const members = (membersData?.populateMembers as unknown as Member[]) ?? [];
  const myMember = members.find((m) => m.email === currentUser?.email);
  const myMemberId = myMember?.$id ?? "";

  // Fetch all my tasks for the badge count
  const { data: myTasksData } = useGetMyTasks({
    workspaceId,
    assigneeId: myMemberId,
  });
  const myTaskCount = myTasksData?.documents?.length ?? 0;

  React.useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const initials = React.useMemo(() => {
    const name: string = user?.name ?? "John Doe";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  }, [user]);

  return (
    <>
      <CreateProjectModal workspaceId={workspaceId} open={open} onOpenChange={setOpen} />
      <Sidebar collapsible="icon" className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
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
              {NAV_ITEMS.map(({ title, id, icon: Icon }) => {
                const href =
                  id === "home"
                    ? `/dashboard/workspace/${workspaceId}`
                    : id === "my-tasks"
                      ? `/dashboard/workspace/${workspaceId}/my-tasks`
                      : `/dashboard/${workspaceId}/${id}`;

                const isActive = pathname === href;

                // Dynamically assign badge only for my-tasks
                const badge = id === "my-tasks" && myTaskCount > 0 ? myTaskCount : null;

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
                      <Link href={href}>
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
              <Plus className="h-3.5 w-3.5" onClick={() => setOpen(true)} />
            </SidebarGroupAction>
            <SidebarMenu>
              <Project />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent" tooltip="Account">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
                    >
                      {initials}
                    </div>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate text-xs font-semibold">{user?.name ?? "John Doe"}</span>
                      <span className="truncate text-[10px] text-sidebar-foreground/50">{user?.email ?? "john@example.com"}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
                      <ChevronsUpDown className="h-3.5 w-3.5 text-sidebar-foreground/40" />
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 focus:text-red-500">Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex justify-end px-2 pb-1 group-data-[collapsible=icon]:justify-center">
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}