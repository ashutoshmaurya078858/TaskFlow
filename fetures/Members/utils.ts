import { DATABASE_ID, MEMBER_ID } from "@/config";
import { Databases, Query } from "node-appwrite";

interface GetMemberProps {
  databases: Databases;
  workspace: string;
  userId: string;
}

export const getmember = async ({
  databases,
  workspace,
  userId,
}: GetMemberProps) => {
  const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
    Query.equal("workspace", workspace),
    Query.equal("userId", userId),
  ]);

  return members.documents[0];
};
