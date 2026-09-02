import type { Metadata } from "next";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { NotificationContent } from "@/components/dashboard/notifications/notifications-content";

export const metadata: Metadata = {
  title: "Notification Settings | EnergyIQ",
  description: "Manage alert delivery preferences for your EnergyIQ account.",
};

export default function SettingsNotificationPage() {
  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Notifications" },
        ]}
      />
      <NotificationContent />
    </div>
  );
}
