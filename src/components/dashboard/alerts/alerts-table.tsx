"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Clock,
  BatteryFull,
  CheckCircle,
  Sun,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Unplug,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import type { Alert, AlertFilterType } from "@/types/alerts";
import { useResolveAlert, useAlertDetail } from "@/hooks/use-alerts-queries";
import { useQueryClient } from "@tanstack/react-query";
import { ALERT_QUERY_KEYS } from "@/hooks/use-alerts-queries";

const FILTER_OPTIONS: { value: AlertFilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "critical", label: "Critical" },
  { value: "resolved", label: "Resolved" },
  { value: "unresolved", label: "Unresolved" },
];

const PER_PAGE_OPTIONS = [10, 20, 50];

const ICON_MAP = {
  battery_low: AlertTriangle,
  power_high: Unplug,
  clock: Clock,
  battery_full: BatteryFull,
  check: CheckCircle,
  solar: Sun,
} as const;

const SEVERITY_STYLES = {
  critical: {
    bg: "bg-red-50",
    dot: "bg-destructive",
    text: "text-destructive",
    label: "Critical",
  },
  warning: {
    bg: "bg-amber-bg-light",
    dot: "bg-amber",
    text: "text-amber-70",
    label: "Warning",
  },
  success: {
    bg: "bg-success-bg",
    dot: "bg-chart-battery",
    text: "text-chart-battery",
    label: "Success",
  },
};

function SeverityBadge({
  severity,
}: {
  severity: keyof typeof SEVERITY_STYLES;
}) {
  const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES.warning;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
        s.bg,
        s.text,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function StatusText({ status }: { status: Alert["status"] }) {
  const label =
    status === "unresolved"
      ? "Unresolved"
      : status === "resolved"
        ? "Resolved"
        : "No action needed";
  return <span className="text-foreground text-sm">{label}</span>;
}

function SkeletonRow() {
  return (
    <tr className="border-border border-b last:border-0">
      <td className="py-4 pr-4 pl-1">
        <div className="flex items-center gap-3">
          <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
          <div className="space-y-1.5">
            <div className="bg-muted h-3.5 w-40 animate-pulse rounded" />
            <div className="bg-muted h-3 w-28 animate-pulse rounded" />
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
      </td>
      <td className="py-4 pr-4">
        <div className="bg-muted h-3.5 w-20 animate-pulse rounded" />
      </td>
      <td className="py-4 pr-4">
        <div className="bg-muted h-3.5 w-24 animate-pulse rounded" />
      </td>
      <td className="py-4">
        <div className="bg-muted ml-auto h-8 w-20 animate-pulse rounded-lg" />
      </td>
    </tr>
  );
}

function InspectModal({
  alertId,
  onClose,
}: {
  alertId: string | null;
  onClose: () => void;
}) {
  const { data: alert, isLoading } = useAlertDetail(alertId);
  const { mutateAsync: resolveAlert, isPending: isResolving } =
    useResolveAlert();
  const Icon = alert?.iconType ? ICON_MAP[alert.iconType] : AlertTriangle;
  const sev = alert?.severity
    ? SEVERITY_STYLES[alert.severity]
    : SEVERITY_STYLES.warning;

  return (
    <Dialog open={!!alertId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md gap-5">
        {isLoading ? (
          <div className="space-y-4 py-6">
            <DialogTitle className="sr-only">Loading alert details</DialogTitle>
            <div className="flex items-center gap-3">
              <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
              </div>
            </div>
            <div className="bg-muted h-20 animate-pulse rounded-xl" />
          </div>
        ) : alert ? (
          <>
            <DialogHeader className="gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    sev.bg,
                  )}
                >
                  <Icon className={cn("h-5 w-5", sev.text)} />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold">
                    {alert.title}
                  </DialogTitle>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {alert.subtitle}. {alert.time}
                  </p>
                </div>
              </div>
            </DialogHeader>
            {alert.modalDetail && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {alert.modalDetail.metrics.map((m) => (
                    <div key={m.label} className="bg-muted rounded-xl p-3">
                      <p className="text-muted-foreground text-xs">{m.label}</p>
                      <p className="text-foreground mt-1 text-base font-bold">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-foreground mb-1.5 text-sm font-semibold">
                    Why this alert?
                  </p>
                  <p className="text-foreground text-sm leading-relaxed">
                    {alert.modalDetail.reason}
                  </p>
                </div>
              </>
            )}
            <div className="flex justify-end">
              {alert.status === "unresolved" ? (
                <Button
                  onClick={async () => {
                    try {
                      await resolveAlert(alert.id);
                      onClose();
                    } catch (error) {
                      const message =
                        error instanceof Error
                          ? error.message
                          : "Unable to resolve alert. Please try again.";
                      toast.error(message);
                    }
                  }}
                  disabled={isResolving}
                  className="bg-secondary text-primary-foreground hover:bg-secondary/80 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  {isResolving ? "Resolving..." : "Resolve Now"}
                </Button>
              ) : (
                <Button
                  disabled
                  className="bg-muted text-muted-foreground rounded-xl px-5 py-2.5 text-sm font-medium"
                >
                  Resolved
                </Button>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function FilterDropdown({
  value,
  onChange,
}: {
  value: AlertFilterType;
  onChange: (v: AlertFilterType) => void;
}) {
  const currentLabel =
    FILTER_OPTIONS.find((o) => o.value === value)?.label ?? "All";
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="border-border bg-card hover:bg-muted flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors">
          <span className="text-muted-foreground">Alert Type:</span>
          <span className="text-foreground">{currentLabel}</span>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="start"
          className="bg-card border-border z-50 min-w-36 overflow-hidden rounded-xl border py-1 shadow-lg"
        >
          {FILTER_OPTIONS.map((opt) => (
            <DropdownMenu.Item
              key={opt.value}
              onSelect={() => onChange(opt.value)}
              className={cn(
                "cursor-pointer px-4 py-2.5 text-sm outline-none transition-colors",
                value === opt.value
                  ? "bg-muted text-foreground font-semibold"
                  : "text-foreground hover:bg-muted",
              )}
            >
              {opt.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPerPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  if (totalItems === 0) return null;

  return (
    <div className="border-border flex flex-col items-start justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:items-center">
      {/* Left: count + per-page */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Showing {start}–{end} of {totalItems}
        </span>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="border-border bg-card hover:bg-muted flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors">
              <span className="text-muted-foreground">Per page:</span>
              <span className="text-foreground">{itemsPerPage}</span>
              <ChevronDown className="text-muted-foreground h-4 w-4" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={4}
              align="start"
              className="bg-card border-border z-50 min-w-28 overflow-hidden rounded-xl border py-1 shadow-lg"
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <DropdownMenu.Item
                  key={n}
                  onSelect={() => onPerPageChange(n)}
                  className={cn(
                    "cursor-pointer px-4 py-2.5 text-sm outline-none transition-colors",
                    itemsPerPage === n
                      ? "bg-muted text-foreground font-semibold"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  {n}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="size-8 rounded-lg"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="text-muted-foreground px-1 text-sm"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(p)}
              className={cn(
                "size-8 rounded-lg text-sm",
                p === currentPage
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="size-8 rounded-lg"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function filterAlerts(alerts: Alert[], filter: AlertFilterType): Alert[] {
  if (filter === "all") return alerts;
  if (filter === "resolved")
    return alerts.filter((a) => a.status === "resolved");
  if (filter === "unresolved")
    return alerts.filter((a) => a.status === "unresolved");
  return alerts.filter((a) => a.severity === filter);
}

function sortAlertsByNewest(alerts: Alert[]): Alert[] {
  return [...alerts].sort(
    (a, b) => new Date(b.sortTime).getTime() - new Date(a.sortTime).getTime(),
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface AlertsTableProps {
  initialData?: Alert[];
  isLoading: boolean;
}

export function AlertsTable({ initialData = [], isLoading }: AlertsTableProps) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<AlertFilterType>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isPendingRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => setSecondsAgo((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (isPendingRef.current) return;
    isPendingRef.current = true;
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ALERT_QUERY_KEYS.all });
      setSecondsAgo(0);
      setRefreshError(false);
    } catch {
      setRefreshError(true);
    } finally {
      setIsRefreshing(false);
      isPendingRef.current = false;
    }
  }, [queryClient]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: AlertFilterType) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePerPageChange = (perPage: number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1);
  };

  const displayed = sortAlertsByNewest(filterAlerts(initialData, filter));
  const totalPages = Math.max(1, Math.ceil(displayed.length / itemsPerPage));

  const paginatedAlerts = displayed.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const unreadCount = initialData.filter(
    (a) => a.status === "unresolved",
  ).length;
  const showLoadingSkeleton = isLoading;

  return (
    <>
      <div className="bg-card border-border overflow-hidden rounded-xl border">
        {/* Header bar */}
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterDropdown value={filter} onChange={handleFilterChange} />
          <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-[#EDEDED] px-3 py-2">
            <span className="flex items-center gap-1.5 text-sm">
              <span className="bg-secondary inline-block h-1.5 w-1.5 rounded-full" />
              <span className="text-foreground font-medium">
                You have {unreadCount} unread alert
                {unreadCount !== 1 ? "s" : ""}
              </span>
            </span>
            {refreshError ? (
              <span className="text-destructive hidden text-sm sm:inline">
                unable to refresh alerts
              </span>
            ) : (
              <span className="text-muted-foreground hidden text-sm sm:inline">
                last updated {secondsAgo} secs ago
              </span>
            )}
            <Button
              variant="ghost"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors disabled:pointer-events-none"
            >
              <RefreshCw
                className={cn(
                  "size-4 transition-transform duration-500",
                  isRefreshing && "animate-spin",
                )}
              />
            </Button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-160 table-fixed">
            <colgroup>
              <col className="w-[46%]" />
              <col className="w-[14%]" />
              <col className="w-[14%]" />
              <col className="w-[16%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted-foreground py-3 pr-4 pl-4 text-left text-sm font-medium">
                  Name
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                  Severity
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-sm font-medium">
                  Time
                </th>
                <th className="text-muted-foreground py-3 pr-4 pl-4 text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {showLoadingSkeleton
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : paginatedAlerts.map((alert) => {
                    const Icon = ICON_MAP[alert.iconType] || AlertTriangle;
                    const isActionable = alert.status === "unresolved";
                    return (
                      <tr
                        key={alert.id}
                        className="border-border border-b last:border-0"
                      >
                        <td className="py-4 pr-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#E8E8E8] flex size-10 shrink-0 items-center justify-center rounded-full">
                              <Icon className="text-[#121212] size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-foreground wrap-break-word text-base font-semibold">
                                {alert.title}
                              </p>
                              <p className="text-muted-foreground mt-0.5 whitespace-normal wrap-break-word text-sm leading-relaxed">
                                {alert.subtitle}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <SeverityBadge severity={alert.severity} />
                        </td>
                        <td className="py-4 pr-4">
                          <StatusText status={alert.status} />
                        </td>
                        <td className="text-muted-foreground py-4 pr-4 text-sm whitespace-nowrap">
                          {alert.time}
                        </td>
                        <td className="py-4 pr-4">
                          <Button
                            onClick={() => {
                              if (!isActionable) return;
                              setSelectedAlertId(alert.id);
                            }}
                            disabled={!isActionable}
                            className={cn(
                              isActionable
                                ? "bg-secondary text-primary-foreground hover:bg-secondary/80"
                                : "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted",
                              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            )}
                          >
                            {isActionable
                              ? "Inspect"
                              : alert.status === "resolved"
                                ? "Resolved"
                                : "No action needed"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              {!showLoadingSkeleton && paginatedAlerts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No alerts match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid min-w-0 gap-4 p-4 md:hidden">
          {paginatedAlerts.map((alert) => {
            const Icon = ICON_MAP[alert.iconType] || AlertTriangle;
            const isActionable = alert.status === "unresolved";
            return (
              <article
                key={alert.id}
                className="min-w-0 max-w-full rounded-xl border border-border bg-card p-4"
              >
                <div className="mb-7">
                  <SeverityBadge severity={alert.severity} />
                </div>
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8E8E8]">
                    <Icon className="size-4 text-[#121212]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-foreground">
                      {alert.title}
                    </h3>
                    <p className="text-muted-foreground mt-0.5 whitespace-normal wrap-break-word text-sm leading-relaxed">
                      {alert.subtitle}
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 truncate text-sm text-muted-foreground">
                    {alert.time}
                  </p>
                  <Button
                    onClick={() => isActionable && setSelectedAlertId(alert.id)}
                    disabled={!isActionable}
                    className={cn(
                      "h-10 w-full rounded-lg px-5 text-sm font-medium sm:w-auto sm:min-w-24",
                      isActionable
                        ? "bg-secondary text-primary-foreground hover:bg-secondary/80"
                        : "bg-muted text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {isActionable
                      ? "Inspect"
                      : alert.status === "resolved"
                        ? "Resolved"
                        : "No action needed"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination bar — shared for both desktop + mobile */}
        {!showLoadingSkeleton && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={displayed.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onPerPageChange={handlePerPageChange}
          />
        )}
      </div>

      <InspectModal
        alertId={selectedAlertId}
        onClose={() => setSelectedAlertId(null)}
      />
    </>
  );
}
