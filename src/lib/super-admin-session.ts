import { cookies } from "next/headers";

export const SUPER_ADMIN_SESSION_COOKIE = "super_admin_session";
const TEMP_SUPER_ADMIN_EMAIL = "admin@gmail.com";
const TEMP_SUPER_ADMIN_PASSWORD = "password";

export async function hasSuperAdminSession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(SUPER_ADMIN_SESSION_COOKIE)?.value);
}

export function isValidSuperAdminCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return (
    email.toLowerCase() === TEMP_SUPER_ADMIN_EMAIL &&
    password === TEMP_SUPER_ADMIN_PASSWORD
  );
}
