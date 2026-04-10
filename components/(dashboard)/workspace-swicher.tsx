"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetWorkspaces } from "@/fetures/workspace/api/use-get-workspaces";
import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";

export function WorkspaceSwitcher() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data, isLoading } = useGetWorkspaces();
  const workspaceID = useWorkspaceId(); // Get ID from URL
  const workspaces = data?.documents || [];
  
  const [activeWorkspace, setActiveWorkspace] = React.useState<any>(null);

  // Synchronize active workspace with the URL ID
  React.useEffect(() => {
    if (workspaces.length === 0) return;

    // 1. Determine which workspace matches the URL (if any)
    const currentWorkspace = workspaceID 
      ? workspaces.find((w: any) => (w.$id || w.id) === workspaceID)
      : null;

    // 2. Extract IDs safely to compare
    const currentId = currentWorkspace ? (currentWorkspace.$id || currentWorkspace.id) : null;
    const activeId = activeWorkspace ? (activeWorkspace.$id || activeWorkspace.id) : null;

    // 3. Update state ONLY if the ID needs to change.
    // If no URL ID matches, this safely sets it to null, triggering the "Select workspace" fallback.
    if (currentId !== activeId) {
      setActiveWorkspace(currentWorkspace || null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceID, workspaces]); 

  const onWorkspaceSelect = (workspace: any) => {
    setActiveWorkspace(workspace);
    const workspaceId = workspace.$id || workspace.id;
    router.push(`/dashboard/workspace/${workspaceId}`); 
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground backdrop-blur-md shadow-sm border-b border-slate-100"
              disabled={isLoading || workspaces.length === 0}
            >
              {/* 1. The Icon */}
              {isLoading ? (
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                  <Loader2 className="size-4 animate-spin" />
                </div>
              ) : (
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                  {activeWorkspace?.imageUrl ? (
                    <Image
                      alt={activeWorkspace.name}
                      height={32}
                      width={32}
                      src={activeWorkspace.imageUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="size-4" />
                  )}
                </div>
              )}

              {/* 2. The Text */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {/* Safely fallback to "Select workspace" if activeWorkspace is null */}
                  {isLoading ? "Loading..." : activeWorkspace?.name || "Select workspace"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {/* Safely fallback the subtext */}
                  {activeWorkspace?.role || "Choose to begin"}
                </span>
              </div>

              {/* 3. The Chevron */}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-md z-50 border-slate-200 bg-white"
            align="start"
            side={isMobile ? "bottom" : "bottom"}
            sideOffset={8}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces {data?.total ? `(${data.total})` : ""}
            </DropdownMenuLabel>
            
            {workspaces.map((workspace: any) => {
              const id = workspace.$id || workspace.id;
              const isActive = activeWorkspace && (activeWorkspace.$id || activeWorkspace.id) === id;
              
              return (
                <DropdownMenuItem
                  key={id}
                  onClick={() => onWorkspaceSelect(workspace)}
                  className={`gap-2 p-2 cursor-pointer ${
                    isActive ? "bg-slate-50 dark:bg-slate-800/50" : ""
                  }`}
                >
                  <div className="flex size-6 items-center justify-center overflow-hidden rounded-md border bg-background">
                    {workspace?.imageUrl ? (
                      <Image
                        alt={workspace.name}
                        height={24}
                        width={24}
                        src={workspace.imageUrl}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="size-3" />
                    )}
                  </div>
                  <span className="truncate font-medium">{workspace.name}</span>
                </DropdownMenuItem>
              );
            })}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              className="gap-2 p-2 cursor-pointer text-muted-foreground"
              onClick={() => router.push('/workspace/create')}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <span className="font-medium">Create workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}