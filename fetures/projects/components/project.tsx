"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen } from "lucide-react";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjects } from "../api/use-get-projects";
import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";
import { cn } from "@/lib/utils";



function ProjectRowSkeleton() {
  return (
    <div className="relative overflow-hidden flex items-center gap-x-2.5 px-2 py-1.5 rounded-lg">
      {/* Sweeping Shimmer Beam */}
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent animate-shimmer" />

      {/* Icon Placeholder */}
      <Skeleton className="size-7 rounded-md bg-gray-200 shrink-0 scale-95" />

      {/* Name Placeholder */}
      <Skeleton className="h-3.5 w-24 bg-gray-100 rounded" />
    </div>
  );
}


const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetProjects({ workspaceId });

  const projects = data?.documents ?? [];

  return (
    <div className="flex flex-col gap-y-1">
      {/* 1. Production Skeleton Loader */}
      {isPending ? (
        <div className="flex flex-col gap-y-1">
          {[...Array(4)].map((_, i) => (
            <ProjectRowSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* 2. Project list */}
          {projects.map((project) => {
            const href = `/dashboard/workspace/${workspaceId}/projects/${project.$id}`;
            const isActive = pathname === href;

            return (
              <Link
                key={project.$id}
                href={href}
                className={cn(
                  "flex items-center gap-x-2.5 px-2 py-1.5 rounded-lg text-sm transition-all group",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                {/* Project Icon/Avatar */}
                <div
                  className={cn(
                    "flex items-center justify-center size-7 rounded-md shrink-0 overflow-hidden border transition-all",
                    isActive
                      ? "border-indigo-200 bg-indigo-100 shadow-sm"
                      : "border-gray-200 bg-gray-100 group-hover:border-gray-300",
                  )}
                >
                  {project.imageUrl ? (
                    <div className="relative size-full">
                      <Image
                        src={project.imageUrl}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <FolderOpen
                      className={cn(
                        "size-3.5",
                        isActive
                          ? "text-indigo-500"
                          : "text-gray-400 group-hover:text-gray-500",
                      )}
                    />
                  )}
                </div>

                {/* Project Name */}
                <span className="truncate">{project.name}</span>
              </Link>
            );
          })}

          {/* 3. Empty State (Optional) */}
          {!isPending && projects.length === 0 && (
            <div className="px-2 py-4 text-center">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                No projects yet
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
