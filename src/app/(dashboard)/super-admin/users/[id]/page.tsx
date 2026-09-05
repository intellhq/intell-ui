import { notFound } from "next/navigation";
import { SuperAdminDetailPage } from "@/components/super-admin/super-admin-pages";
import { SUPER_ADMIN_DASHBOARD_ROWS, SUPER_ADMIN_USER_ROWS } from "@/constants/super-admin";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = [...SUPER_ADMIN_USER_ROWS, ...SUPER_ADMIN_DASHBOARD_ROWS].find(
    (item) => item.id === id,
  );

  if (!row) notFound();

  return (
    <SuperAdminDetailPage
      row={row}
      kind="users"
      backHref="/super-admin/users"
      title="User Details"
    />
  );
}
