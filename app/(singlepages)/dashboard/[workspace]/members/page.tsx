import MembersPage from '@/components/(dashboard)/members'
import { getCurrent } from '@/fetures/auth/action';
import { redirect } from 'next/navigation';

interface PageProps {
  // 1. Update the interface to match your exact folder name
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
    // 3. Map the 'workspace' param to the 'workspaceId' prop that your Client Component expects
    <MembersPage workspaceId={resolvedParams.workspace} />
  )
}

export default page;