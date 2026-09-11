import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstallerDashboardDetailPage } from "@/components/installer/installer-pages";
import { getInstallerDashboard } from "@/constants/installer";

type InstallerDashboardPageProps = {
  params: Promise<{ dashboardId: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: InstallerDashboardPageProps): Promise<Metadata> {
  const { dashboardId } = await params;
  const dashboard = getInstallerDashboard(dashboardId);

  return {
    title: dashboard ? `${dashboard.siteName} | Installer` : "Installer Dashboard",
    description: dashboard
      ? `View ${dashboard.siteName} metrics and alerts as an assigned installer.`
      : "View assigned customer dashboard metrics and alerts.",
  };
}

export default async function InstallerDashboardPage({
  params,
  searchParams,
}: InstallerDashboardPageProps) {
  const { dashboardId } = await params;
  const resolvedSearchParams = await searchParams;
  const activeTab =
    resolvedSearchParams.tab === "alerts" ? "alerts" : "dashboard";

  if (!getInstallerDashboard(dashboardId)) {
    notFound();
  }

  return (
    <InstallerDashboardDetailPage
      dashboardId={dashboardId}
      activeTab={activeTab}
    />
  );
}
