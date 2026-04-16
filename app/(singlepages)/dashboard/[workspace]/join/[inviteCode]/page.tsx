import { getCurrent } from "@/fetures/auth/action";
import { GetOneworkspageInfo } from "@/fetures/workspace/action";
import JoinWorkspaceClient from "@/fetures/workspace/components/join-workspace-client";
import { redirect, notFound } from "next/navigation"; // Import notFound

interface JoinWorkspacePageProp {
  params: Promise<{
    workspace: string;
    inviteCode: string;
  }>;
}

const JoinWorkspacePage = async ({ params }: JoinWorkspacePageProp) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const { workspace, inviteCode } = await params;

  const workspaceInfo = await GetOneworkspageInfo({
    workspaceId: workspace,
  });

  // CRITICAL FIX: Prevent crash if workspace doesn't exist
  if (!workspaceInfo) {
    notFound();
  }

  return (
    <div>
      <JoinWorkspaceClient
        inviteCode={inviteCode}
        workspace={workspace}
        workspaceInfo={workspaceInfo}
      />
    </div>
  );
};

export default JoinWorkspacePage;
