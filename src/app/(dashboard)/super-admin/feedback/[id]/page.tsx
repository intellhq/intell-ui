import { notFound } from "next/navigation";
import { SuperAdminFeedbackDetailPage } from "@/components/super-admin/super-admin-pages";
import { SUPER_ADMIN_FEEDBACK_ROWS } from "@/constants/super-admin";

export default async function FeedbackDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = SUPER_ADMIN_FEEDBACK_ROWS.find((item) => item.id === id);

  if (!row) notFound();

  return <SuperAdminFeedbackDetailPage row={row} />;
}
