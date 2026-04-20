import "server-only";
import { AUTH_COOKIE } from "@/app/(auth)/constence";
import { cookies } from "next/headers";
import { Account, Client, Databases } from "node-appwrite";
import { cache } from "react";
import { DATABASE_ID, PROJECT_ID } from "@/config";
import { project } from "./typs";
import { getmember } from "../members/utils";

interface GetProjectByIdProps {
  projectId: string;
}

export const GetProjects = async ({ projectId }: GetProjectByIdProps) => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE);

    if (!session) return null;

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APP_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT!)
      .setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    // Fetch the project document from the correct collection
    const projectDoc = await databases.getDocument<project>(
      DATABASE_ID,
      PROJECT_ID,
      projectId,
    );

    // Verify the user is a member of the workspace this project belongs to
    const member = await getmember({
      databases,
      userId: user.$id,
      workspaceId: projectDoc.workspaceId,
    });

    if (!member) return null;

    return projectDoc;
  } catch (error) {
    console.error("GET_PROJECT_ERROR", error);
    return null;
  }
}