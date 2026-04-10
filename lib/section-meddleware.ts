import "server-only";
import {
  Account,
  Client,
  Databases,
  Storage,
  Models,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
} from "node-appwrite";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE } from "@/app/(auth)/constence";

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    try {
      const session = getCookie(c, AUTH_COOKIE);

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APP_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APP_APPWRITE_PROJECT!)
        .setSession(session);

      const account = new Account(client);
      const databases = new Databases(client);
      const storage = new Storage(client);

      const user = await account.get();

      // attach to context
      c.set("account", account);
      c.set("databases", databases);
      c.set("storage", storage);
      c.set("user", user);

      await next();
    } catch (error) {
      console.error("SESSION_MIDDLEWARE_ERROR", error);
      return c.json({ error: "Unauthorized" }, 401);
    }
  }
);