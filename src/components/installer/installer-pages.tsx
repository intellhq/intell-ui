"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Battery,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MessageSquareText,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sun,
  Upload,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { AlertsTable } from "@/components/dashboard/alerts/alerts-table";
import { MetricCard } from "@/components/dashboard/cards/metric-card";
import { BatteryCard } from "@/components/dashboard/cards/battery-card";
import {
  SavedMonthCard,
  SavedTodayCard,
} from "@/components/dashboard/cards/savings-card";
import {
  EnergyUsageChart,
  type Period,
} from "@/components/dashboard/charts/energy-usage-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  installerAlerts,
  installerDashboards,
  installerProfile,
  getInstallerDashboard,
  type InstallerConnectedDashboard,
  type InstallerDashboardStatus,
} from "@/constants/installer";
import { useAuthStore } from "@/stores/auth-store";
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

function StatusBadge({ status }: { status: InstallerDashboardStatus }) {
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

function SummaryCard({
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

function DashboardCard({
  dashboard,
}: {
  dashboard: InstallerConnectedDashboard;
}) {
  const statusTone =
    dashboard.status === "Healthy"
      ? "bg-emerald-50 text-emerald-700"
      : dashboard.status === "Needs attention"
        ? "bg-amber-bg-light text-amber-70"
        : "bg-muted text-muted-foreground";
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
            statusTone,
          )}
        >
          <StatusIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-lg font-semibold text-foreground">
            {dashboard.siteName}
          </h2>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {dashboard.ownerName} · {dashboard.inverter}
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
          <StatusBadge status={dashboard.status} />
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

function InstallerEmptyState() {
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
        adds you as their installer. Once added, you will be able to view their
        dashboard metrics and alerts from this workspace.
      </p>
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
          sub={`${dashboard.inverter} · ${dashboard.location}`}
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
        <SummaryCard
          label="Connected dashboards"
          value={`${connected}`}
          detail="Customers who added you as an installer"
          icon={ShieldCheck}
        />
        <SummaryCard
          label="Open alerts"
          value={`${openAlerts}`}
          detail="Alerts visible across assigned dashboards"
          icon={AlertTriangle}
        />
        <SummaryCard
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
              <DashboardCard key={dashboard.id} dashboard={dashboard} />
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
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
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

export function InstallerDashboardDetailPage({
  dashboardId,
  activeTab = "dashboard",
}: {
  dashboardId: string;
  activeTab?: "dashboard" | "alerts";
}) {
  const dashboard = getInstallerDashboard(dashboardId);

  if (!dashboard) {
    return null;
  }

  const alerts = installerAlerts[dashboardId] ?? [];

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Installer", href: "/installer" },
          { label: dashboard.siteName },
        ]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="min-w-0">
            <div className="mb-3">
              <StatusBadge status={dashboard.status} />
            </div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight lg:text-3xl">
              {dashboard.siteName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {dashboard.ownerName} · {dashboard.location} · {dashboard.inverter}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-border">
        <nav
          className="-mb-px flex gap-4 overflow-x-auto sm:gap-6 [&::-webkit-scrollbar]:hidden"
          aria-label="Installer dashboard tabs"
        >
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              href: `/installer/${dashboardId}`,
            },
            {
              id: "alerts",
              label: "Alerts",
              href: `/installer/${dashboardId}?tab=alerts`,
            },
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

export function InstallerSettingsPage() {
  const settingCards = [
    {
      icon: UserRound,
      title: "Account & Profile",
      description:
        "Manage your installer identity, contact details, company information and service coverage.",
      href: "/installer/settings/profile",
    },
    {
      icon: MessageSquareText,
      title: "Feedback & Support",
      description:
        "Share installer workflow feedback, report access issues, or contact the INTELL support team.",
      href: "/installer/settings/feedback",
    },
  ];

  return (
    <div className="space-y-6 sm:p-0">
      <DashboardBreadcrumb
        items={[{ label: "Installer", href: "/installer" }, { label: "Settings" }]}
      />

      <div>
        <h1 className="text-2xl font-bold text-dark-text">Settings Overview</h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Manage your installer profile, access, and support preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {settingCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="block h-full">
              <div className="flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-colors hover:border-border/80">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6]">
                  <Icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-dark-text">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5D5C5D]">
                  {card.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function InstallerProfileSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const displayName =
    user && `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : installerProfile.name;

  return (
    <div className="space-y-4">
      <DashboardBreadcrumb
        items={[
          { label: "Installer", href: "/installer" },
          { label: "Settings", href: "/installer/settings" },
          { label: "Profile" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text">Profile Settings</h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Installer identity and contact details attached to customer dashboards.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-dark-text">
          Profile Photo
        </h2>
        <p className="mt-0.5 text-sm text-[#5D5C5D]">PNG or JPG, up to 2MB.</p>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#D1D5DB]">
            <span className="text-xl font-semibold text-[#374151]">
              {displayName
                .split(" ")
                .map((part) => part.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-dark-text transition-colors hover:bg-muted"
          >
            <Upload className="h-4 w-4" />
            Upload photo
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-text">
            Installer Profile
          </h2>
          <p className="mt-0.5 text-sm text-[#5D5C5D]">
            These details help customers identify who has access to their
            dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Name" value={displayName} />
          <ReadOnlyField
            label="Email"
            value={user?.email ?? installerProfile.email}
          />
          <ReadOnlyField label="Phone" value={installerProfile.phone} />
          <ReadOnlyField label="Company" value={installerProfile.company} />
          <ReadOnlyField label="Role" value={installerProfile.role} />
          <ReadOnlyField
            label="Installer type"
            value={installerProfile.installerType}
          />
          <ReadOnlyField
            label="Service area"
            value={installerProfile.serviceArea}
          />
        </div>
      </div>
    </div>
  );
}

export function InstallerFeedbackPage() {
  const user = useAuthStore((state) => state.user);
  const [category, setCategory] = useState("Customer dashboard access");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const displayName = useMemo(() => {
    const authName =
      user && `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    return authName || installerProfile.name;
  }, [user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Installer feedback submitted successfully.");
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <DashboardBreadcrumb
        items={[
          { label: "Installer", href: "/installer" },
          { label: "Settings", href: "/installer/settings" },
          { label: "Feedback & Support" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text">
          Feedback & Support
        </h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Send installer workflow feedback, access issues, or monitoring support
          requests to INTELL.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-text">
            Account Information
          </h2>
          <p className="mt-0.5 text-sm text-[#5D5C5D]">
            Your installer account details are attached automatically.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReadOnlyField label="Name" value={displayName} />
          <ReadOnlyField
            label="Email"
            value={user?.email ?? installerProfile.email}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-base font-semibold text-dark-text">
              Submit Installer Feedback
            </h2>
            <p className="mt-0.5 text-sm text-[#5D5C5D]">
              Add enough context for the team to understand the customer,
              dashboard, or inverter issue.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-dark-text">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-14 rounded-lg border-input bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer dashboard access">
                    Customer dashboard access
                  </SelectItem>
                  <SelectItem value="Inverter monitoring issue">
                    Inverter monitoring issue
                  </SelectItem>
                  <SelectItem value="Alert visibility">
                    Alert visibility
                  </SelectItem>
                  <SelectItem value="Partner onboarding">
                    Partner onboarding
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-dark-text">
                Priority
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-14 rounded-lg border-input bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1.5">
            <Label
              htmlFor="installer-feedback-message"
              className="text-sm font-medium text-dark-text"
            >
              Message
            </Label>
            <Textarea
              id="installer-feedback-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Describe the customer dashboard, inverter, access, or alert issue."
              className="min-h-52 resize-none rounded-lg border-input bg-background px-3 py-3 text-sm"
              required
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-white transition-colors hover:bg-secondary/90 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
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
