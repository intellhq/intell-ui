import { NextResponse } from "next/server";
import {
  SUPER_ADMIN_SESSION_COOKIE,
  isValidSuperAdminCredentials,
} from "@/lib/super-admin-session";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  if (!isValidSuperAdminCredentials({ email, password })) {
    return NextResponse.json(
      { success: false, message: "Invalid super admin credentials." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SUPER_ADMIN_SESSION_COOKIE, crypto.randomUUID(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SUPER_ADMIN_SESSION_COOKIE);
  return response;
}
