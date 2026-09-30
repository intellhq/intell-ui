import { SuperAdminInstallerDetailPage } from "@/components/super-admin/super-admin-pages";

export default async function InstallerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SuperAdminInstallerDetailPage id={id} />;
}
