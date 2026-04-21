"use client";

import { useState } from "react";
import { Pencil, FolderOpen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EditProjectModal } from "./edit-project-model";

interface ProjectHeaderProps {
  projectId: string;
  workspaceId: string;
  name: string;
  imageUrl?: string;
}

export function ProjectHeader({
  projectId,
  workspaceId,
  name,
  imageUrl,
}: ProjectHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <EditProjectModal
        open={editOpen}
        onOpenChange={setEditOpen}
        projectId={projectId}
        workspaceId={workspaceId}
        initialName={name}
        initialImageUrl={imageUrl}
      />

      <div className="flex items-center justify-between">
        {/* Left — icon + name */}
        <div className="flex items-center gap-3">
          {/* Project icon */}
          <div className="relative size-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <FolderOpen className="size-5 text-gray-400" />
            )}
          </div>

          {/* Name */}
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {name}
          </h1>
        </div>

        {/* Right — edit button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
          className="flex items-center gap-1.5 h-9 px-3 text-sm border-gray-300 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
        >
          <Pencil className="size-3.5" />
          Edit Project
        </Button>
      </div>
    </>
  );
}