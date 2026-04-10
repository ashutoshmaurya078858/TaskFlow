// src/app/oauth/route.js

import { createAdminClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "../(auth)/constence";
import { revalidatePath } from "next/cache";

export async function GET(request:NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  if (!userId || !secret) {
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax", // <-- This is the crucial fix for OAuth flows
    secure: process.env.NODE_ENV === "production", 
  });

  revalidatePath("/", "layout");

  return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
}