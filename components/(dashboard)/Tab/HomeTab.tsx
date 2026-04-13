import { Getworkspage } from '@/fetures/workspace/action';
import { redirect } from 'next/navigation';

const HomeTab = async () => {
  const workspaces = await Getworkspage();

  if (workspaces.total === 0) {
    redirect("/dashboard/create");
  } else {
    redirect(`/dashboard/workspace/${workspaces.documents[0].$id}`);
  }

  return null; // important: no UI after redirect
};

export default HomeTab;