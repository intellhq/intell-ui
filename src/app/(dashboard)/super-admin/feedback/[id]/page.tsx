import { SuperAdminFeedbackDetailPage } from "@/components/super-admin/super-admin-pages";

export default async function FeedbackDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SuperAdminFeedbackDetailPage id={id} />;
}
