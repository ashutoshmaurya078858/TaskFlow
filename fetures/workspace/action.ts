import "server-only";
import { AUTH_COOKIE } from "@/app/(auth)/constence";
import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { cache, use } from "react";
import { DATABASE_ID, MEMBER_ID, WORKSPACES_ID } from "@/config";
import { getmember } from "../Members/utils";
import { workspace } from "./typs";

// Wrap your async function in cache()
export const Getworkspage = cache(async () => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE);

    if (!session) return { documents: [], total: 0 };

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APP_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT!)
      .setSession(session.value);

    const databases = new Databases(client);
    const acount = new Account(client);
    const user = await acount.get();
    // 1. Query the MEMBERS collection, not the WORKSPACES collection
    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBER_ID, // <-- FIX: This was previously WORKSPACES_ID
      [Query.equal("userId", user.$id)],
    );

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    // 2. Query the actual workspaces using the extracted IDs
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.equal("$id", workspaceIds), // <-- FIX: Changed from Query.contains
      ],
    );
    return workspaces;
  } catch (error) {
    console.error("GET_CURRENT_ERROR", error);
    return { documents: [], total: 0 };
  }
});

interface GetOneworkspageProps {
  workspaceId: string;
}

export const GetOneworkspage = cache(
  async ({ workspaceId }: GetOneworkspageProps) => {
    try {
      const cookieStore = await cookies();
      const session = cookieStore.get(AUTH_COOKIE);

      if (!session) return null;

      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APP_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT!)
        .setSession(session.value);

      const databases = new Databases(client);
      const acount = new Account(client);
      const user = await acount.get();
      const member = await getmember({
        databases,
        userId: user.$id,
        workspaceId: workspaceId,
      });
      if (!member) return null;

      const workspace = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
      );

      return JSON.parse(JSON.stringify(workspace));
     
    } catch (error) {
      console.error("GET_CURRENT_ERROR", error);
      return { documents: [], total: 0 };
    }
  },
);
