"use client";

import { AlertTriangle, Battery, ChevronLeft, ChevronRight, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { installerDashboards, installerProfile } from "@/constants/installer";
import {
  InstallerDashboardCard,
  InstallerEmptyState,
  InstallerSummaryCard,
} from "@/components/installer/installer-shared";

export function InstallerOverviewPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;
  const connected = installerDashboards.length;
  const openAlerts = installerDashboards.reduce(
    (total, dashboard) => total + dashboard.openAlerts,
    0,
  );
  const needsAttention = installerDashboards.filter(
    (dashboard) => dashboard.status !== "Healthy",
  ).length;
  const visibleDashboards = installerDashboards.filter((dashboard) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return [
      dashboard.siteName,
      dashboard.ownerName,
      dashboard.location,
      dashboard.inverter,
      dashboard.status,
    ].some((value) => value.toLowerCase().includes(term));
  });
  const totalPages = Math.max(1, Math.ceil(visibleDashboards.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedDashboards = visibleDashboards.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight lg:text-3xl">
            Good afternoon, {installerProfile.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here are the customer systems assigned to you today
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-[10px] border border-[#EDEDED] bg-white px-2 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-success-alt/50" />
          <span className="font-medium text-success-alt">
            Installer access active
          </span>
          <span className="text-muted-foreground">-</span>
          <span className="text-muted-foreground">2 min ago</span>
          <RefreshCw className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InstallerSummaryCard
          label="Connected dashboards"
          value={`${connected}`}
          detail="Customers who added you as an installer"
          icon={ShieldCheck}
        />
        <InstallerSummaryCard
          label="Open alerts"
          value={`${openAlerts}`}
          detail="Alerts visible across assigned dashboards"
          icon={AlertTriangle}
        />
        <InstallerSummaryCard
          label="Needs attention"
          value={`${needsAttention}`}
          detail="Sites with offline or warning status"
          icon={Battery}
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Assigned systems
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {visibleDashboards.length} of {connected} dashboards
            </p>
          </div>
          <label className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search customers, sites, or inverters"
              className="h-11 rounded-lg border-border bg-white pl-9 text-sm"
            />
          </label>
        </div>

        {connected === 0 ? (
          <InstallerEmptyState />
        ) : visibleDashboards.length === 0 ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
            No assigned dashboards match your search.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {paginatedDashboards.map((dashboard) => (
              <InstallerDashboardCard key={dashboard.id} dashboard={dashboard} />
            ))}
          </div>
        )}
        {connected > 0 && totalPages > 1 ? (
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="size-9 rounded-lg"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="size-9 rounded-lg"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
