import HomeTab from "@/components/(dashboard)/Tab/HomeTab";
import MembersTab from "@/components/(dashboard)/Tab/MembersTab";
import SettingsTab from "@/components/(dashboard)/Tab/SettingsTab";
import TasksTab from "@/components/(dashboard)/Tab/TasksTab";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const currentTab = tab || "home";

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