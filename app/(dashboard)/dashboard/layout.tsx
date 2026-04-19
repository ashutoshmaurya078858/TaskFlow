import { getCurrent } from "@/fetures/auth/action";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/(dashboard)/dashboard-shell"; // Update path if needed

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const safeUser = JSON.parse(JSON.stringify(user));

  return (
    // Wrap the entire layout in the Shell
    <DashboardShell user={safeUser}>{children}</DashboardShell>
  );
}
