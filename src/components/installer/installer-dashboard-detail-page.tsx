"use client";

import Link from "next/link";
import { Sun, Zap } from "lucide-react";
import { useState } from "react";
import { AlertsTable } from "@/components/dashboard/alerts/alerts-table";
import { BatteryCard } from "@/components/dashboard/cards/battery-card";
import { MetricCard } from "@/components/dashboard/cards/metric-card";
import {
  SavedMonthCard,
  SavedTodayCard,
} from "@/components/dashboard/cards/savings-card";
import {
  EnergyUsageChart,
  type Period,
} from "@/components/dashboard/charts/energy-usage-chart";
import { Button } from "@/components/ui/button";
import {
  getInstallerDashboard,
  installerAlerts,
  type InstallerConnectedDashboard,
} from "@/constants/installer";
import {
  InstallerCrumbs,
  InstallerStatusBadge,
} from "@/components/installer/installer-shared";
import { cn } from "@/lib/utils";

const installerEnergyUsage = [
  { day: "Mon", generated: 22, used: 18 },
  { day: "Tue", generated: 25, used: 20 },
  { day: "Wed", generated: 21, used: 19 },
  { day: "Thu", generated: 29, used: 24 },
  { day: "Fri", generated: 32, used: 26 },
  { day: "Sat", generated: 27, used: 22 },
  { day: "Sun", generated: 24, used: 21 },
];

export function InstallerDashboardDetailPage({
  dashboardId,
  activeTab = "dashboard",
}: {
  dashboardId: string;
  activeTab?: "dashboard" | "alerts";
}) {
  const dashboard = getInstallerDashboard(dashboardId);

  if (!dashboard) return null;

  const alerts = installerAlerts[dashboardId] ?? [];

  return (
    <div className="space-y-6">
      <InstallerCrumbs
        items={[
          { label: "Installer", href: "/installer" },
          { label: dashboard.siteName },
        ]}
      />

      <div>
        <div className="mb-3">
          <InstallerStatusBadge status={dashboard.status} />
        </div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight lg:text-3xl">
          {dashboard.siteName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dashboard.ownerName} - {dashboard.location} - {dashboard.inverter}
        </p>
      </div>

      <div className="border-b border-border">
        <nav
          className="-mb-px flex gap-4 overflow-x-auto sm:gap-6 [&::-webkit-scrollbar]:hidden"
          aria-label="Installer dashboard tabs"
        >
          {[
            { id: "dashboard", label: "Dashboard", href: `/installer/${dashboardId}` },
            { id: "alerts", label: "Alerts", href: `/installer/${dashboardId}?tab=alerts` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                asChild
                variant="ghost"
                className={cn(
                  "rounded-none whitespace-nowrap border-0 border-b-2 pb-1 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground/80",
                )}
              >
                <Link href={tab.href}>{tab.label}</Link>
              </Button>
            );
          })}
        </nav>
      </div>

      {activeTab === "alerts" ? (
        <AlertsTable initialData={alerts} isLoading={false} />
      ) : (
        <InstallerDashboardMetrics dashboard={dashboard} />
      )}
    </div>
  );
}

function InstallerDashboardMetrics({
  dashboard,
}: {
  dashboard: InstallerConnectedDashboard;
}) {
  const [period, setPeriod] = useState<Period>("Daily");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={Sun}
          label="Solar Input"
          value={dashboard.solarInputKw}
          unit="kW"
          sub={`Last synced ${dashboard.lastUpdated}`}
          pill={dashboard.solarInputKw > 0 ? "Generating" : "Offline"}
          pillTone={dashboard.solarInputKw > 0 ? "success" : "muted"}
        />
        <BatteryCard percent={dashboard.batteryPercent} />
        <MetricCard
          icon={Zap}
          iconClass="text-success-alt/70"
          label="Running now"
          value={dashboard.runningLoadKw}
          unit="kW"
          sub={`${dashboard.inverter} - ${dashboard.location}`}
          pill={dashboard.status === "Offline" ? "Offline" : "Active"}
          pillTone={dashboard.status === "Offline" ? "muted" : "success"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SavedMonthCard
          amount={41200}
          months={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          active="Jun"
        />
        <SavedTodayCard amount={8430} />
      </div>

      <EnergyUsageChart
        data={installerEnergyUsage}
        period={period}
        onPeriodChange={setPeriod}
        isLoading={false}
      />
    </div>
  );
}
