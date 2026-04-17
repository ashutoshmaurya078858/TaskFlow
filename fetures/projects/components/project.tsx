import React from "react";
import { useGetProjects } from "../api/use-get-projects";
import { usePathname } from "next/navigation";
import { useWorkspaceId } from "@/fetures/workspace/hookes/use-workspace-id";

const Project = () => {
  const projectId = null;
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data, isPending } = useGetProjects({ workspaceId });
  console.log(data);
  return <div>Project</div>;
};

export default Project;
