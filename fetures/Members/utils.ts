import { DATABASE_ID, MEMBER_ID } from "@/config";
import { Databases, Query } from "node-appwrite";

interface GetMemberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const getmember = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => {
  const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
    Query.equal("workspaceId", workspaceId),
    Query.equal("userId", userId),
  ]);

  return members.documents[0];
};
