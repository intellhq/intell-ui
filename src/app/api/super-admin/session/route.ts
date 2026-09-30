import { NextResponse } from "next/server";
import { SUPER_ADMIN_SESSION_COOKIE } from "@/lib/super-admin-session";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;
const ALLOWED_ADMIN_ROLES = new Set(["admin", "super_admin"]);

function getBackendAuthUrl() {
  const base =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:3001/api/v1";

  return `${base.replace(/\/+$/, "")}/auth/login`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  const backendResponse = await fetch(getBackendAuthUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  }).catch(() => null);

  if (!backendResponse?.ok) {
    return NextResponse.json(
      { success: false, message: "Invalid super admin credentials." },
      { status: 401 },
    );
  }

  const payload = (await backendResponse.json().catch(() => null)) as {
    data?: {
      accessToken?: string;
      sessionId?: string;
      user?: { role?: string };
    };
  } | null;
  const data = payload?.data;

  if (!data?.accessToken || !ALLOWED_ADMIN_ROLES.has(data.user?.role ?? "")) {
    return NextResponse.json(
      { success: false, message: "Admin access is required." },
      { status: 403 },
    );
  }

  const response = NextResponse.json({
    success: true,
    data: {
      accessToken: data.accessToken,
      sessionId: data.sessionId,
      user: data.user,
    },
  });
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
  response.cookies.set(SUPER_ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
