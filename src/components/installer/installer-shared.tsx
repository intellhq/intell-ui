"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, MapPin, ShieldCheck, type LucideIcon } from "lucide-react";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  InstallerConnectedDashboard,
  InstallerDashboardStatus,
} from "@/constants/installer";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  InstallerDashboardStatus,
  { className: string; icon: LucideIcon }
> = {
  Healthy: {
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  "Needs attention": {
    className: "bg-amber-bg-light text-amber-70",
    icon: AlertTriangle,
  },
  Offline: {
    className: "bg-muted text-muted-foreground",
    icon: Clock,
  },
};

export function InstallerCrumbs({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) {
  return <DashboardBreadcrumb items={items} />;
}

export function InstallerStatusBadge({
  status,
}: {
  status: InstallerDashboardStatus;
}) {
  const style = statusStyles[status];
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        style.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

export function InstallerSummaryCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="h-5 w-5 text-secondary" />
        </div>
      </div>
    </div>
  );
}

export function InstallerDashboardCard({
  dashboard,
}: {
  dashboard: InstallerConnectedDashboard;
}) {
  const StatusIcon = statusStyles[dashboard.status].icon;

  return (
    <Link
      href={`/installer/${dashboard.id}`}
      className="group block min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-white p-4 transition-colors hover:border-border/80 sm:p-5"
    >
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            statusStyles[dashboard.status].className,
          )}
        >
          <StatusIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-lg font-semibold text-foreground">
            {dashboard.siteName}
          </h2>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {dashboard.ownerName} - {dashboard.inverter}
          </p>
          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex min-w-0 max-w-full items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="min-w-0 truncate">{dashboard.location}</span>
            </span>
            <span className="whitespace-nowrap">
              Last synced {dashboard.lastUpdated}
            </span>
            <span className="whitespace-nowrap">
              {dashboard.openAlerts} open alert
              {dashboard.openAlerts === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <InstallerStatusBadge status={dashboard.status} />
          <span className="min-w-0 break-words text-sm text-muted-foreground">
            Added by{" "}
            <span className="font-medium text-foreground">
              {dashboard.addedBy}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export function InstallerEmptyState() {
  return (
    <div className="rounded-xl border border-border bg-white p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6] text-gray-700">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-dark-text">
        No assigned systems yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5D5C5D]">
        Customer dashboards will appear here after a customer or business owner
        adds you as their installer.
      </p>
    </div>
  );
}

export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-dark-text">{label}</Label>
      <Input
        value={value}
        disabled
        readOnly
        className="h-14 w-full rounded-lg border-input bg-background px-3 text-sm outline-none disabled:cursor-default disabled:opacity-60"
      />
    </div>
  );
}
