import { notFound } from "next/navigation";
import { SuperAdminInstallerDetailPage } from "@/components/super-admin/super-admin-pages";
import { SUPER_ADMIN_INSTALLER_ROWS } from "@/constants/super-admin";

export default async function InstallerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = SUPER_ADMIN_INSTALLER_ROWS.find((item) => item.id === id);

  if (!row) notFound();

  return <SuperAdminInstallerDetailPage row={row} />;
}
