import { notFound } from "next/navigation";
import { SuperAdminCommunicationDetailPage } from "@/components/super-admin/super-admin-pages";
import { SUPER_ADMIN_COMMUNICATION_ROWS } from "@/constants/super-admin";

export default async function CommunicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = SUPER_ADMIN_COMMUNICATION_ROWS.find((item) => item.id === id);

  if (!row) notFound();

  return <SuperAdminCommunicationDetailPage row={row} />;
}
