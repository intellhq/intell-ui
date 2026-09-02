import { redirect } from "next/navigation";
import { SuperAdminShell } from "@/components/super-admin/super-admin-shell";
import { hasSuperAdminSession } from "@/lib/super-admin-session";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await hasSuperAdminSession())) {
    redirect("/super-admin");
  }

  return (
    <SuperAdminShell>{children}</SuperAdminShell>
  );
}
