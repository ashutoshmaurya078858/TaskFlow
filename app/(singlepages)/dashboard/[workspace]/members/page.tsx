import MembersPage from "@/components/(dashboard)/members";
import { getCurrent } from "@/fetures/auth/action";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    workspace: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  // 2. Await the params
  const resolvedParams = await params;
  return (
    <MembersPage workspaceId={resolvedParams.workspace} />
  );
};

export default page;
