import { GetProjects } from "@/fetures/projects/quaries";

interface PageProps {
  params: Promise<{
    workspace: string;
    projectId: string;
  }>;
}

const ProjectPage = async ({ params }: PageProps) => {
  const { workspace, projectId } = await params;
const inisialValues = await GetProjects({ projectId:projectId });

  return (
    <div>
      <h1>Project Page</h1>
      <p>Workspace ID: {workspace}</p>
      <p>Project ID: {projectId}</p>
      <p>{JSON.stringify(inisialValues?.name)}</p>
    </div>
  );
};

export default ProjectPage;
