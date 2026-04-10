import "server-only";
import { AUTH_COOKIE } from "@/app/(auth)/constence";
import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { cache } from "react"; // <-- Import cache from React

// Wrap your async function in cache()
export const getCurrent = cache(async () => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE);

    if (!session) return null;

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APP_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT!)
      .setSession(session.value);

    const account = new Account(client);
    const user = await account.get();

    return user;
  } catch (error) {
    console.error("GET_CURRENT_ERROR", error);
    return null;
  }
});