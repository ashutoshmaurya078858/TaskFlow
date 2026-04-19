import HomeTab from "@/components/(dashboard)/Tab/HomeTab";
import MembersTab from "@/components/(dashboard)/Tab/MembersTab";
import SettingsTab from "@/components/(dashboard)/Tab/SettingsTab";
import TasksTab from "@/components/(dashboard)/Tab/TasksTab";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ tab?: string }> | { tab?: string };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // We no longer need to fetch the user here because the layout handles the protection
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams?.tab || "home";

  // Just return the active component directly
  switch (currentTab) {
    case "my-tasks":
      return <TasksTab />;
    case "members":
      return <MembersTab />;
    case "settings":
      return <SettingsTab />;
    case "home":
    default:
      return <HomeTab />;
  }
}
