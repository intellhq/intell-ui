import { ComingSoonDashboard } from "@/components/dashboard/coming-soon";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";

export default function ReviewLogsPage() {
  return (
    <div>
      <div className="mb-6">
        <DashboardBreadcrumb
          items={[
            { label: "Settings", href: "/dashboard/settings" },
            { label: "Review Logs" },
          ]}
        />
      </div>
      <ComingSoonDashboard
        feature="Security Audit Logs"
        description="Review security audit logs, track access history, and monitor anomalies across your INTELL environment."
      />
    </div>
  );
}
