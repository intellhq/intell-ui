import { notFound } from "next/navigation";
import { SuperAdminLeadDetailPage } from "@/components/super-admin/super-admin-pages";
import { SUPER_ADMIN_ONBOARDING_LEAD_ROWS } from "@/constants/super-admin";

export default async function OnboardingLeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = SUPER_ADMIN_ONBOARDING_LEAD_ROWS.find((item) => item.id === id);

  if (!row) notFound();

  return <SuperAdminLeadDetailPage row={row} />;
}
