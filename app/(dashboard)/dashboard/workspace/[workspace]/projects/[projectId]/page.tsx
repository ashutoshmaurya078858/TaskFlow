import { ProjectHeader } from "@/fetures/projects/components/ProjectHeader";
import { GetProjects } from "@/fetures/projects/quaries";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    workspace: string;
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: PageProps) => {
  const { workspace, projectId } = await params;
  const project = await GetProjects({ projectId });

  if (!project) redirect(`/dashboard/workspace/${workspace}`);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <ProjectHeader
        projectId={project.$id}
        workspaceId={project.workspaceId}
        name={project.name}
        imageUrl={project.imageUrl}
      />

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Page content goes here */}
      <div className="text-sm text-gray-400">
        Project content coming soon...
      </div>
    </div>
  );
};

export default ProjectPage;