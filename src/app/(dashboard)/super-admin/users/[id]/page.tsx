import { SuperAdminDetailPage } from "@/components/super-admin/super-admin-pages";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SuperAdminDetailPage id={id} />;
}
