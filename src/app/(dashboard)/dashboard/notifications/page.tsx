import type { Metadata } from "next";
import { DashboardNotificationsContent } from "@/components/dashboard/notifications/dashboard-notifications-content";

export const metadata: Metadata = {
  title: "Notifications | EnergyIQ",
  description: "Review recent alerts and system updates across your account.",
};

export default function NotificationsPage() {
  return <DashboardNotificationsContent />;
}
