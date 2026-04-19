import { getCurrent } from "@/fetures/auth/action";
import { GetOneworkspage } from "@/fetures/workspace/action";
import { EditWorkspaceForm } from "@/fetures/workspace/components/edit-workspace";
import { redirect } from "next/navigation";
import React from "react";

interface settingsProp {
  params: {
    workspace: string;
  };
}

const page = async ({ params }: settingsProp) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const { workspace } = await params;
  const initialValues = await GetOneworkspage({ workspaceId: workspace });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default page;
