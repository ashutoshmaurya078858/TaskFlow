import "server-only"
import { Client, Account, Users } from "node-appwrite";

// Admin client, used to create new accounts
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APP_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!); // Set the API key here!

  // Return the services you need
  return {
    get account() {
      return new Account(client);
    },
     get users() {
      return new Users(client); // ← was Account, should be Users
    },
  };
}