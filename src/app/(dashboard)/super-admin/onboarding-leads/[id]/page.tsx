import { SuperAdminLeadDetailPage } from "@/components/super-admin/super-admin-pages";

export default async function OnboardingLeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SuperAdminLeadDetailPage id={id} />;
}
