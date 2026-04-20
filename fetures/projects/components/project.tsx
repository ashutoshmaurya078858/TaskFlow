"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FolderOpen, Plus, Loader2 } from "lucide-react";
import Image from "next/image";

import { useGetProjects } from "../api/use-get-projects";
import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";
import { cn } from "@/lib/utils";
import { CreateProjectModal } from "./project-model";

const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetProjects({ workspaceId });

  const projects = data?.documents ?? [];

  return (
    <>
      <div className="flex flex-col gap-y-1">
        {/* Loading */}
        {isPending && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="size-4 animate-spin text-gray-400" />
          </div>
        )}
        {/* Project list */}
        {projects.map((project) => {
          const href = `/dashboard/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;

          return (
            <Link
              key={project.$id}
              href={href}
              className={cn(
                "flex items-center gap-x-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors group",
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex items-center justify-center size-7 rounded-md shrink-0 overflow-hidden border",
                  isActive
                    ? "border-indigo-200 bg-indigo-100"
                    : "border-gray-200 bg-gray-100",
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
                      isActive ? "text-indigo-500" : "text-gray-400",
                    )}
                  />
                )}
              </div>

              {/* Name */}
              <span className="truncate">{project.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Projects;
