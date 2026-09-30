"use client";

import Link from "next/link";
import { useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateSuperAdmin,
  useSuperAdminAdmins,
  useSuperAdminAiUsageChart,
  useSuperAdminFeedback,
  useSuperAdminFeedbackSummary,
  useSuperAdminInstallers,
  useSuperAdminInstallersSummary,
  useSuperAdminLeads,
  useSuperAdminLeadsSummary,
  useSuperAdminRecentUsers,
  useSuperAdminSummary,
  useSuperAdminUsers,
  useSuperAdminUsersChart,
} from "@/hooks/use-super-admin-queries";
import { cn } from "@/lib/utils";
import type { ApiPaginationMeta } from "@/lib/api/client";
import type {
  ChartPoint,
  FeedbackPriority,
  FeedbackStatus,
  InstallerStatus,
  OnboardingLeadStatus,
  SuperAdminUser,
} from "@/types/super-admin-api";

type FilterState = {
  search: string;
  status: string;
  priority: string;
  role: string;
  type: string;
  page: number;
};

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "all",
  priority: "all",
  role: "all",
  type: "all",
  page: 1,
};

const LIMIT = 10;

function formatDate(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatNumber(value?: number | null) {
  return new Intl.NumberFormat("en-NG").format(value ?? 0);
}

function fullName(user: Pick<SuperAdminUser, "firstName" | "lastName">) {
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unnamed user";
}

function userStatus(user: SuperAdminUser) {
  if (user.isActive === false) return "inactive";
  if (user.emailVerified === false) return "pending";
  return "active";
}

function statusLabel(value?: string | null) {
  if (!value) return "Unknown";
  return value.replaceAll("_", " ");
}

function statusClass(value?: string | null) {
  const status = value?.toLowerCase();
  if (["active", "resolved", "converted", "qualified"].includes(status ?? "")) {
    return "bg-chart-battery text-success-alt";
  }
  if (["open", "new", "pending"].includes(status ?? "")) {
    return "bg-muted text-muted-foreground";
  }
  if (["in_progress", "contacted"].includes(status ?? "")) {
    return "bg-amber-30/20 text-amber-50";
  }
  if (["suspended", "closed", "inactive"].includes(status ?? "")) {
    return "bg-destructive/10 text-destructive";
  }
  return "bg-secondary/10 text-secondary";
}

function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ value }: { value?: string | null }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        statusClass(value),
      )}
    >
      {statusLabel(value)}
    </span>
  );
}

function PriorityBadge({ value }: { value?: FeedbackPriority }) {
  if (!value) return <span className="text-muted-foreground">-</span>;
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        value === "high"
          ? "bg-destructive/10 text-destructive"
          : value === "medium"
            ? "bg-blue-500/10 text-blue-600"
            : "bg-muted text-muted-foreground",
      )}
    >
      {statusLabel(value)}
    </span>
  );
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

function SectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
      <p className="font-semibold text-destructive">Unable to load this section.</p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function FilterBar({
  filters,
  onChange,
  children,
}: {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string | number) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <label className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search"
          className="h-11 rounded-lg border-border bg-card pl-9"
        />
      </label>
      {children}
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
  placeholder = "Filter",
}: {
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full rounded-lg border-border bg-card md:w-44">
        <span className="flex items-center gap-2">
          <Filter className="size-4" />
          <SelectValue placeholder={placeholder} />
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function PaginationControls({
  pagination,
  page,
  onPageChange,
}: {
  pagination?: ApiPaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
}) {
  if (!pagination || (pagination.total ?? 0) <= (pagination.limit ?? LIMIT)) return null;
  return (
    <div className="mt-4 flex items-center justify-end gap-3 text-sm text-muted-foreground">
      <Button
        variant="outline"
        size="sm"
        disabled={!pagination.hasPrev}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Previous
      </Button>
      <span>
        Page {pagination.page ?? page} of{" "}
        {Math.max(1, Math.ceil((pagination.total ?? 0) / (pagination.limit ?? LIMIT)))}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={!pagination.hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted text-xs text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-5 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}

function useFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  return {
    filters,
    setPage: (page: number) => setFilters((current) => ({ ...current, page })),
    updateFilter: (key: keyof FilterState, value: string | number) =>
      setFilters((current) => ({ ...current, [key]: value, page: 1 })),
  };
}

export function SuperAdminDashboardPage() {
  const summary = useSuperAdminSummary();
  const usersChart = useSuperAdminUsersChart();
  const aiUsageChart = useSuperAdminAiUsageChart();
  const recentUsers = useSuperAdminRecentUsers({ page: 1, limit: 6 });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Live platform activity across users, installers, leads, feedback, and AI usage."
      />

      {summary.isLoading ? (
        <SectionSkeleton />
      ) : summary.isError ? (
        <ErrorState onRetry={() => summary.refetch()} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Users"
            value={formatNumber(summary.data?.users.total)}
            helper={`${formatNumber(summary.data?.users.newThisMonth)} joined this month`}
          />
          <StatCard
            label="Installers"
            value={formatNumber(summary.data?.installers.total)}
            helper={`${formatNumber(summary.data?.installers.partners)} partners, ${formatNumber(summary.data?.installers.technicians)} technicians`}
          />
          <StatCard
            label="Onboarding leads"
            value={formatNumber(summary.data?.leads.total)}
            helper={`${formatNumber(summary.data?.leads.qualified)} qualified leads`}
          />
          <StatCard
            label="Feedback"
            value={formatNumber(summary.data?.feedback.total)}
            helper={`${formatNumber(summary.data?.feedback.open)} open feedback items`}
          />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartSection
          title="Users chart"
          isLoading={usersChart.isLoading}
          isError={usersChart.isError}
          onRetry={() => usersChart.refetch()}
          data={usersChart.data?.points ?? []}
          bars={["free", "paid"]}
        />
        <ChartSection
          title="AI usage chart"
          isLoading={aiUsageChart.isLoading}
          isError={aiUsageChart.isError}
          onRetry={() => aiUsageChart.refetch()}
          data={aiUsageChart.data?.points ?? []}
          bars={["inputTokens", "outputTokens"]}
        />
      </div>

      <UsersTableSection
        title="Recent users"
        query={recentUsers}
        paginationPage={1}
        onPageChange={() => undefined}
        compact
      />
    </div>
  );
}

function ChartSection({
  title,
  isLoading,
  isError,
  onRetry,
  data,
  bars,
}: {
  title: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  data: ChartPoint[];
  bars: string[];
}) {
  if (isLoading) return <SectionSkeleton rows={6} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            {bars.map((bar, index) => (
              <Bar
                key={bar}
                dataKey={bar}
                fill={index === 0 ? "#F5B800" : "#111827"}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function UsersTableSection({
  title,
  query,
  paginationPage,
  onPageChange,
  compact = false,
}: {
  title: string;
  query: ReturnType<typeof useSuperAdminUsers> | ReturnType<typeof useSuperAdminRecentUsers>;
  paginationPage: number;
  onPageChange: (page: number) => void;
  compact?: boolean;
}) {
  if (query.isLoading) return <SectionSkeleton rows={6} />;
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />;
  if (!query.data?.data.length) {
    return <EmptyState title="No users found" detail="Users will appear here once available." />;
  }
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-foreground">{title}</h2>
      <DataTable
        columns={["User", "Role", "Status", "Last login", "Joined"]}
        rows={query.data.data.map((user) => (
          <tr key={user.id} className="border-t border-border hover:bg-muted/40">
            <td className="px-5 py-4">
              <Link href={`/super-admin/users/${user.id}`} className="font-semibold text-foreground">
                {fullName(user)}
              </Link>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </td>
            <td className="px-5 py-4 capitalize text-muted-foreground">{user.role}</td>
            <td className="px-5 py-4">
              <StatusBadge value={userStatus(user)} />
            </td>
            <td className="px-5 py-4 text-muted-foreground">
              {formatDate(user.lastLoginAt)}
            </td>
            <td className="px-5 py-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
          </tr>
        ))}
      />
      {!compact ? (
        <PaginationControls
          pagination={query.data.pagination}
          page={paginationPage}
          onPageChange={onPageChange}
        />
      ) : null}
    </section>
  );
}

export function SuperAdminUsersPage() {
  const { filters, setPage, updateFilter } = useFilters();
  const query = useSuperAdminUsers({
    page: filters.page,
    limit: LIMIT,
    search: filters.search,
    status: filters.status,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Users" />
      <FilterBar filters={filters} onChange={updateFilter}>
        <FilterSelect
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={[
            { label: "All statuses", value: "all" },
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </FilterBar>
      <UsersTableSection
        title="All users"
        query={query}
        paginationPage={filters.page}
        onPageChange={setPage}
      />
    </div>
  );
}

export function SuperAdminAdminsPage() {
  const { filters, setPage, updateFilter } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "admin" as "admin" | "super_admin",
  });
  const query = useSuperAdminAdmins({
    page: filters.page,
    limit: LIMIT,
    search: filters.search,
    role: filters.role,
    status: filters.status,
  });
  const createAdmin = useCreateSuperAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admins"
        action={
          <Button onClick={() => setIsOpen(true)} className="bg-secondary text-white">
            <Plus className="size-4" />
            Invite Admin
          </Button>
        }
      />
      <FilterBar filters={filters} onChange={updateFilter}>
        <FilterSelect
          value={filters.role}
          onChange={(value) => updateFilter("role", value)}
          options={[
            { label: "All roles", value: "all" },
            { label: "Admin", value: "admin" },
            { label: "Super admin", value: "super_admin" },
          ]}
        />
      </FilterBar>
      {query.isLoading ? (
        <SectionSkeleton rows={6} />
      ) : query.isError ? (
        <ErrorState onRetry={() => query.refetch()} />
      ) : !query.data?.data.length ? (
        <EmptyState title="No admins found" detail="Invited admins will appear here." />
      ) : (
        <>
          <DataTable
            columns={["Admin", "Email", "Role", "Status", "Date added"]}
            rows={query.data.data.map((admin) => (
              <tr key={admin.id} className="border-t border-border">
                <td className="px-5 py-4 font-semibold text-foreground">{fullName(admin)}</td>
                <td className="px-5 py-4 text-muted-foreground">{admin.email}</td>
                <td className="px-5 py-4 capitalize text-muted-foreground">{admin.role}</td>
                <td className="px-5 py-4">
                  <StatusBadge value={admin.adminStatus ?? userStatus(admin)} />
                </td>
                <td className="px-5 py-4 text-muted-foreground">{formatDate(admin.createdAt)}</td>
              </tr>
            ))}
          />
          <PaginationControls
            pagination={query.data.pagination}
            page={filters.page}
            onPageChange={setPage}
          />
        </>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite admin</DialogTitle>
            <DialogDescription>
              Create an admin account for the INTELL operations dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="First name" value={form.firstName} onChange={(value) => setForm({ ...form, firstName: value })} />
            <InputField label="Last name" value={form.lastName} onChange={(value) => setForm({ ...form, lastName: value })} />
            <InputField label="Email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(role) =>
                  setForm({ ...form, role: role as "admin" | "super_admin" })
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={createAdmin.isPending}
              onClick={() => createAdmin.mutate(form, { onSuccess: () => setIsOpen(false) })}
              className="bg-secondary text-white"
            >
              {createAdmin.isPending ? "Inviting..." : "Invite admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export function SuperAdminInstallersPage() {
  const { filters, setPage, updateFilter } = useFilters();
  const summary = useSuperAdminInstallersSummary();
  const query = useSuperAdminInstallers({
    page: filters.page,
    limit: LIMIT,
    search: filters.search,
    status:
      filters.status === "all" ? undefined : (filters.status as InstallerStatus),
    type: filters.type === "all" ? undefined : (filters.type as "partner" | "technician"),
  });

  return (
    <ListPageShell title="Installers">
      <SummaryCards
        isLoading={summary.isLoading}
        isError={summary.isError}
        onRetry={() => summary.refetch()}
        cards={[
          ["Total installers", summary.data?.total, "Partner and technician profiles"],
          ["Active", summary.data?.active, "Installers currently active"],
          ["Pending", summary.data?.pending, "Profiles awaiting action"],
        ]}
      />
      <FilterBar filters={filters} onChange={updateFilter}>
        <FilterSelect
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={[
            { label: "All statuses", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Active", value: "active" },
            { label: "Suspended", value: "suspended" },
          ]}
        />
        <FilterSelect
          value={filters.type}
          onChange={(value) => updateFilter("type", value)}
          options={[
            { label: "All types", value: "all" },
            { label: "Partner", value: "partner" },
            { label: "Technician", value: "technician" },
          ]}
        />
      </FilterBar>
      <InstallersTable query={query} page={filters.page} onPageChange={setPage} />
    </ListPageShell>
  );
}

function InstallersTable({
  query,
  page,
  onPageChange,
}: {
  query: ReturnType<typeof useSuperAdminInstallers>;
  page: number;
  onPageChange: (page: number) => void;
}) {
  if (query.isLoading) return <SectionSkeleton rows={6} />;
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />;
  if (!query.data?.data.length) {
    return <EmptyState title="No installers found" detail="Installer profiles will appear here." />;
  }
  return (
    <>
      <DataTable
        columns={["Installer", "Type", "Company", "Region", "Status", "Joined"]}
        rows={query.data.data.map((installer) => (
          <tr key={installer.id} className="border-t border-border hover:bg-muted/40">
            <td className="px-5 py-4">
              <Link href={`/super-admin/installers/${installer.id}`} className="font-semibold text-foreground">
                {installer.contactName}
              </Link>
              <p className="text-xs text-muted-foreground">{installer.email}</p>
            </td>
            <td className="px-5 py-4 capitalize text-muted-foreground">{installer.type}</td>
            <td className="px-5 py-4 text-muted-foreground">{installer.companyName ?? "-"}</td>
            <td className="px-5 py-4 text-muted-foreground">{installer.region ?? installer.state ?? "-"}</td>
            <td className="px-5 py-4"><StatusBadge value={installer.status} /></td>
            <td className="px-5 py-4 text-muted-foreground">{formatDate(installer.createdAt)}</td>
          </tr>
        ))}
      />
      <PaginationControls pagination={query.data.pagination} page={page} onPageChange={onPageChange} />
    </>
  );
}

export function SuperAdminOnboardingLeadsPage() {
  const { filters, setPage, updateFilter } = useFilters();
  const summary = useSuperAdminLeadsSummary();
  const query = useSuperAdminLeads({
    page: filters.page,
    limit: LIMIT,
    search: filters.search,
    status:
      filters.status === "all"
        ? undefined
        : (filters.status as OnboardingLeadStatus),
  });

  return (
    <ListPageShell title="Onboarding leads">
      <SummaryCards
        isLoading={summary.isLoading}
        isError={summary.isError}
        onRetry={() => summary.refetch()}
        cards={[
          ["Total leads", summary.data?.total, "All submitted onboarding leads"],
          ["New", summary.data?.new, "Leads waiting for first follow-up"],
          ["Qualified", summary.data?.qualified, "Leads ready for next step"],
        ]}
      />
      <FilterBar filters={filters} onChange={updateFilter}>
        <FilterSelect
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={[
            { label: "All statuses", value: "all" },
            { label: "New", value: "new" },
            { label: "Contacted", value: "contacted" },
            { label: "Qualified", value: "qualified" },
            { label: "Converted", value: "converted" },
            { label: "Closed", value: "closed" },
          ]}
        />
      </FilterBar>
      <LeadsTable query={query} page={filters.page} onPageChange={setPage} />
    </ListPageShell>
  );
}

function LeadsTable({
  query,
  page,
  onPageChange,
}: {
  query: ReturnType<typeof useSuperAdminLeads>;
  page: number;
  onPageChange: (page: number) => void;
}) {
  if (query.isLoading) return <SectionSkeleton rows={6} />;
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />;
  if (!query.data?.data.length) {
    return <EmptyState title="No leads found" detail="Waitlist submissions will appear here." />;
  }
  return (
    <>
      <DataTable
        columns={["Lead", "State", "Inverter", "Interest", "Status", "Submitted"]}
        rows={query.data.data.map((lead) => (
          <tr key={lead.id} className="border-t border-border hover:bg-muted/40">
            <td className="px-5 py-4">
              <Link href={`/super-admin/onboarding-leads/${lead.id}`} className="font-semibold text-foreground">
                {lead.firstName} {lead.lastName}
              </Link>
              <p className="text-xs text-muted-foreground">{lead.email}</p>
            </td>
            <td className="px-5 py-4 text-muted-foreground">{lead.state}</td>
            <td className="px-5 py-4 text-muted-foreground">{lead.inverterType}</td>
            <td className="px-5 py-4 text-muted-foreground">{statusLabel(lead.interest)}</td>
            <td className="px-5 py-4"><StatusBadge value={lead.status} /></td>
            <td className="px-5 py-4 text-muted-foreground">{formatDate(lead.createdAt)}</td>
          </tr>
        ))}
      />
      <PaginationControls pagination={query.data.pagination} page={page} onPageChange={onPageChange} />
    </>
  );
}

export function SuperAdminFeedbackPage() {
  const { filters, setPage, updateFilter } = useFilters();
  const summary = useSuperAdminFeedbackSummary();
  const query = useSuperAdminFeedback({
    page: filters.page,
    limit: LIMIT,
    search: filters.search,
    status:
      filters.status === "all" ? undefined : (filters.status as FeedbackStatus),
    priority:
      filters.priority === "all"
        ? undefined
        : (filters.priority as FeedbackPriority),
  });

  return (
    <ListPageShell title="Feedback">
      <SummaryCards
        isLoading={summary.isLoading}
        isError={summary.isError}
        onRetry={() => summary.refetch()}
        cards={[
          ["Total feedback", summary.data?.total, "All feedback records"],
          ["Open", summary.data?.open, "Items still open"],
          ["High priority", summary.data?.highPriority, "Requires closer review"],
        ]}
      />
      <FilterBar filters={filters} onChange={updateFilter}>
        <FilterSelect
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          options={[
            { label: "All statuses", value: "all" },
            { label: "Open", value: "open" },
            { label: "In progress", value: "in_progress" },
            { label: "Resolved", value: "resolved" },
          ]}
        />
        <FilterSelect
          value={filters.priority}
          onChange={(value) => updateFilter("priority", value)}
          options={[
            { label: "All priorities", value: "all" },
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ]}
        />
      </FilterBar>
      <FeedbackTable query={query} page={filters.page} onPageChange={setPage} />
    </ListPageShell>
  );
}

function FeedbackTable({
  query,
  page,
  onPageChange,
}: {
  query: ReturnType<typeof useSuperAdminFeedback>;
  page: number;
  onPageChange: (page: number) => void;
}) {
  if (query.isLoading) return <SectionSkeleton rows={6} />;
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />;
  if (!query.data?.data.length) {
    return <EmptyState title="No feedback found" detail="User feedback will appear here." />;
  }
  return (
    <>
      <DataTable
        columns={["Feedback", "Category", "Status", "Priority", "Submitted"]}
        rows={query.data.data.map((feedback) => (
          <tr key={feedback.id} className="border-t border-border hover:bg-muted/40">
            <td className="px-5 py-4">
              <Link href={`/super-admin/feedback/${feedback.id}`} className="font-semibold text-foreground">
                {feedback.name ?? "INTELL user"}
              </Link>
              <p className="max-w-md truncate text-xs text-muted-foreground">{feedback.message}</p>
            </td>
            <td className="px-5 py-4 text-muted-foreground">{feedback.category}</td>
            <td className="px-5 py-4"><StatusBadge value={feedback.status} /></td>
            <td className="px-5 py-4"><PriorityBadge value={feedback.priority} /></td>
            <td className="px-5 py-4 text-muted-foreground">{formatDate(feedback.createdAt)}</td>
          </tr>
        ))}
      />
      <PaginationControls pagination={query.data.pagination} page={page} onPageChange={onPageChange} />
    </>
  );
}

function SummaryCards({
  isLoading,
  isError,
  onRetry,
  cards,
}: {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  cards: Array<[string, number | undefined, string]>;
}) {
  if (isLoading) return <SectionSkeleton rows={3} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(([label, value, helper]) => (
        <StatCard key={label} label={label} value={formatNumber(value)} helper={helper} />
      ))}
    </div>
  );
}

function ListPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} />
      {children}
    </div>
  );
}
