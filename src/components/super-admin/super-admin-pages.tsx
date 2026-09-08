"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Filter,
  Plus,
  Search,
  Users,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  SUPER_ADMIN_ACTIVITY_LOG,
  SUPER_ADMIN_ADMIN_ROWS,
  SUPER_ADMIN_COMMUNICATION_ROWS,
  SUPER_ADMIN_DASHBOARD_ROWS,
  SUPER_ADMIN_FEEDBACK_ROWS,
  SUPER_ADMIN_FILTER_OPTIONS,
  SUPER_ADMIN_INSTALLER_ROWS,
  SUPER_ADMIN_METRICS,
  SUPER_ADMIN_ONBOARDING_LEAD_ROWS,
  SUPER_ADMIN_OVERVIEW_CHARTS,
  SUPER_ADMIN_USER_ROWS,
} from "@/constants/super-admin";
import type {
  SuperAdminActivity,
  SuperAdminMetric,
  SuperAdminPriority,
  SuperAdminRouteKey,
  SuperAdminTableRow,
} from "@/types/super-admin";
import { cn } from "@/lib/utils";

type Tab = "list" | "activity";
type DialogMode = "admin" | "paid-users" | null;
type FilterState = {
  search: string;
  status: string;
  priority: string;
  role: string;
  plan: string;
  date: string;
  interest: string;
  installerType: string;
  source: string;
};

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "All",
  priority: "All",
  role: "All",
  plan: "All",
  date: "All",
  interest: "All",
  installerType: "All",
  source: "All",
};

function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
      {action}
    </div>
  );
}

function StatCard({ metric }: { metric: SuperAdminMetric }) {
  const Icon = metric.icon;

  return (
    <div className="flex min-h-34 flex-col justify-between rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {metric.value}
        </p>
        <p className="mt-3 text-sm text-positive">{metric.change}</p>
        <p className="mt-1 text-xs text-muted-foreground">{metric.helper}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SuperAdminTableRow["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        status === "Active" && "bg-chart-battery text-success-alt",
        status === "Resolved" && "bg-chart-battery text-success-alt",
        status === "Open" && "bg-muted text-muted-foreground",
        status === "In Progress" && "bg-amber-30/20 text-amber-50",
        status === "Pending" && "bg-muted text-muted-foreground",
        status === "Invited" && "bg-muted text-muted-foreground",
        status === "Qualified" && "bg-secondary/10 text-secondary",
        status === "Contacted" && "bg-blue-500/10 text-blue-600",
        status === "Delivered" && "bg-chart-battery text-success-alt",
        status === "Draft" && "bg-muted text-muted-foreground",
        status === "Scheduled" && "bg-secondary/10 text-secondary",
        status === "Failed" && "bg-destructive/10 text-destructive",
      )}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority?: SuperAdminPriority }) {
  if (!priority || priority === "-") {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
        priority === "High" && "bg-destructive/10 text-destructive",
        priority === "Medium" && "bg-blue-500/10 text-blue-600",
        priority === "Low" && "bg-muted text-muted-foreground",
      )}
    >
      {priority}
    </span>
  );
}

function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full min-w-0 rounded-lg border-border bg-card px-3 text-muted-foreground sm:w-auto sm:min-w-36">
        <span className="flex min-w-0 items-center gap-2">
          {label === "Date" ? (
            <Calendar className="size-4 shrink-0" />
          ) : (
            <Filter className="size-4 shrink-0" />
          )}
          <SelectValue placeholder={label} />
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SearchAndFilters({
  roleFilter,
  planFilter,
  leadFilter,
  installerFilter,
  communicationFilter,
  filters,
  onFilterChange,
}: {
  roleFilter?: boolean;
  planFilter?: boolean;
  leadFilter?: boolean;
  installerFilter?: boolean;
  communicationFilter?: boolean;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}) {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:items-center">
        <div className="relative col-span-2 w-full md:w-72">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            className="h-11 rounded-lg border-border bg-card pl-9"
          />
        </div>
        {roleFilter ? (
          <FilterDropdown
            label="All"
            options={SUPER_ADMIN_FILTER_OPTIONS.role}
            value={filters.role}
            onChange={(value) => onFilterChange("role", value)}
          />
        ) : planFilter ? (
          <FilterDropdown
            label="All"
            options={SUPER_ADMIN_FILTER_OPTIONS.plan}
            value={filters.plan}
            onChange={(value) => onFilterChange("plan", value)}
          />
        ) : leadFilter ? (
          <>
            <FilterDropdown
              label="Stage"
              options={SUPER_ADMIN_FILTER_OPTIONS.status}
              value={filters.status}
              onChange={(value) => onFilterChange("status", value)}
            />
            <FilterDropdown
              label="Interest"
              options={SUPER_ADMIN_FILTER_OPTIONS.interest}
              value={filters.interest}
              onChange={(value) => onFilterChange("interest", value)}
            />
            <FilterDropdown
              label="Source"
              options={SUPER_ADMIN_FILTER_OPTIONS.source}
              value={filters.source}
              onChange={(value) => onFilterChange("source", value)}
            />
            <FilterDropdown
              label="Date"
              options={SUPER_ADMIN_FILTER_OPTIONS.date}
              value={filters.date}
              onChange={(value) => onFilterChange("date", value)}
            />
          </>
        ) : installerFilter ? (
          <>
            <FilterDropdown
              label="Installer Type"
              options={SUPER_ADMIN_FILTER_OPTIONS.installerType}
              value={filters.installerType}
              onChange={(value) => onFilterChange("installerType", value)}
            />
            <FilterDropdown
              label="Account Status"
              options={["All", "Active", "Pending"]}
              value={filters.status}
              onChange={(value) => onFilterChange("status", value)}
            />
            <FilterDropdown
              label="Date"
              options={SUPER_ADMIN_FILTER_OPTIONS.date}
              value={filters.date}
              onChange={(value) => onFilterChange("date", value)}
            />
          </>
        ) : communicationFilter ? (
          <>
            <FilterDropdown
              label="Delivery Status"
              options={SUPER_ADMIN_FILTER_OPTIONS.communicationStatus}
              value={filters.status}
              onChange={(value) => onFilterChange("status", value)}
            />
            <FilterDropdown
              label="Date"
              options={SUPER_ADMIN_FILTER_OPTIONS.date}
              value={filters.date}
              onChange={(value) => onFilterChange("date", value)}
            />
          </>
        ) : (
          <>
            <FilterDropdown
              label="Status"
              options={SUPER_ADMIN_FILTER_OPTIONS.status}
              value={filters.status}
              onChange={(value) => onFilterChange("status", value)}
            />
            <FilterDropdown
              label="Priority"
              options={SUPER_ADMIN_FILTER_OPTIONS.priority}
              value={filters.priority}
              onChange={(value) => onFilterChange("priority", value)}
            />
            <FilterDropdown
              label="Date"
              options={SUPER_ADMIN_FILTER_OPTIONS.date}
              value={filters.date}
              onChange={(value) => onFilterChange("date", value)}
            />
          </>
        )}
      </div>
    </div>
  );
}

function SectionTabs({
  value,
  onChange,
  first = "List",
}: {
  value: Tab;
  onChange: (value: Tab) => void;
  first?: string;
}) {
  return (
    <div className="mb-8 flex gap-8 border-b border-border">
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "relative pb-3 text-sm font-medium text-muted-foreground",
          value === "list" && "text-foreground",
        )}
      >
        {first}
        {value === "list" ? (
          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground" />
        ) : null}
      </button>
      <button
        type="button"
        onClick={() => onChange("activity")}
        className={cn(
          "relative pb-3 text-sm font-medium text-muted-foreground",
          value === "activity" && "text-foreground",
        )}
      >
        Activity Log
        {value === "activity" ? (
          <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground" />
        ) : null}
      </button>
    </div>
  );
}

function getDetailHref(kind: string, id: string) {
  if (kind === "dashboard") return `/super-admin/users/${id}`;
  return `/super-admin/${kind}/${id}`;
}

function DataTable({
  rows,
  kind,
}: {
  rows: SuperAdminTableRow[];
  kind:
    | "admins"
    | "users"
    | "feedback"
    | "communications"
    | "dashboard"
    | "installers"
    | "onboarding-leads";
}) {
  const router = useRouter();
  const columns = useMemo(() => {
    if (kind === "admins")
      return ["Name", "Email", "Role", "Status", "Date Added"];
    if (kind === "users")
      return [
        "Users",
        "Account Status",
        "Payment Status",
        "Last Log-in",
        "Amount Spent",
      ];
    if (kind === "dashboard")
      return [
        "Users",
        "Account Status",
        "Payment Status",
        "Registration Date",
        "Amount Spent",
      ];
    if (kind === "installers")
      return [
        "Installer",
        "Type",
        "Company",
        "Region",
        "Users Managed",
        "Joined",
      ];
    if (kind === "onboarding-leads")
      return ["Lead", "State", "Inverter", "Interest", "Source", "Submitted"];
    if (kind === "communications")
      return ["Subject", "Audience", "Stage", "CTA", "Date"];
    return [
      "ID",
      kind === "feedback" ? "Feedback content" : "Submitted by",
      "Status",
      "Priority",
      "Date Submitted",
    ];
  }, [kind]);

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
          <tbody>
            {rows.map((row) => {
              const rowHref =
                kind === "admins" ? null : getDetailHref(kind, row.id);

              return (
                <tr
                  key={row.id}
                  role={rowHref ? "link" : undefined}
                  tabIndex={rowHref ? 0 : undefined}
                  onClick={() => {
                    if (rowHref) router.push(rowHref);
                  }}
                  onKeyDown={(event) => {
                    if (!rowHref) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(rowHref);
                    }
                  }}
                  className={cn(
                    "border-t border-border",
                    rowHref &&
                      "cursor-pointer transition-colors hover:bg-muted/40",
                  )}
                >
                  {kind === "admins" ? (
                    <>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            <Users className="size-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {row.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {row.meta}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.email}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.role}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.date}
                      </td>
                    </>
                  ) : kind === "users" || kind === "dashboard" ? (
                    <>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                          <Users className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{row.name}</p>
                          <p className="text-xs text-muted-foreground">{row.meta}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-4 text-muted-foreground">{row.role}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.date}</td>
                    <td className="px-5 py-4 font-medium text-foreground">{row.amount}</td>
                  </>
                ) : kind === "installers" ? (
                  <>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.installerType}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.company}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{row.region}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.usersManaged}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{row.date}</td>
                  </>
                ) : kind === "onboarding-leads" ? (
                  <>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{row.state}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.inverterType}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{row.role}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {row.source}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{row.date}</td>
                  </>
                ) : (
                  <>
                    {kind === "communications" ? (
                      <>
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground">{row.name}</p>
                          <p className="mt-1 max-w-md truncate text-muted-foreground">
                            {row.content}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {row.audience}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {row.actionLabel}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {row.date}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-foreground">
                          {row.id}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground">{row.name}</p>
                          <p className="mt-1 max-w-md truncate text-muted-foreground">
                            {row.content}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-5 py-4">
                          <PriorityBadge priority={row.priority} />
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {row.date}
                        </td>
                      </>
                    )}
                  </>
                )}
              </tr>
            );
            })}
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-muted-foreground"
                >
                  No records match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivityTable({ rows }: { rows: SuperAdminActivity[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border bg-muted px-5 py-3 text-sm font-medium">
        Recent activity
      </div>
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex flex-col gap-2 border-b border-border px-5 py-4 text-sm last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="text-muted-foreground">{row.action}</span>
          <span className="text-muted-foreground">{row.date}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({ 
  title, 
  value, 
  input, 
  output, 
  inputLabel = "Input",
  outputLabel = "Output",
  icon: Icon, 
}: (typeof SUPER_ADMIN_OVERVIEW_CHARTS)[number]) { 
  const chartData = input.map((inputValue, index) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][
      index
    ],
    input: inputValue,
    output: output[index] ?? 0,
  }));

  return ( 
    <div className="rounded-xl border border-border bg-card p-5"> 
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="h-56 min-w-0 overflow-hidden rounded-lg border border-border bg-muted/20 p-2 sm:p-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart
            data={chartData}
            barGap={4}
            barCategoryGap="24%"
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          >
            <CartesianGrid
              stroke="var(--border)"
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              width={42}
              tickFormatter={(tick: number) =>
                tick >= 1000000 ? `${Math.round(tick / 1000000)}m` : `${tick}`
              }
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              formatter={(tooltipValue, name) => [
                Number(tooltipValue).toLocaleString(),
                name === "input" ? inputLabel : outputLabel,
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card)",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="input"
              fill="var(--color-amber-30)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="output"
              fill="var(--color-amber-60)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div> 
      <div className="mt-3 flex justify-end gap-4 text-xs text-muted-foreground"> 
        <span className="flex items-center gap-1"> 
          <span className="size-2 rounded-full bg-amber-30" /> 
          {inputLabel}
        </span> 
        <span className="flex items-center gap-1"> 
          <span className="size-2 rounded-full bg-amber-60" /> 
          {outputLabel}
        </span> 
      </div> 
    </div>
  );
}

function filterRows(rows: SuperAdminTableRow[], filters: FilterState) {
  const query = filters.search.trim().toLowerCase();
  const now = new Date();

  return rows.filter((row) => {
    const haystack = [
      row.id,
      row.name,
      row.email,
      row.content,
      row.role,
      row.status,
      row.priority,
      row.date,
      row.meta,
      row.amount,
      row.phone,
      row.state,
      row.inverterType,
      row.company,
      row.sites,
      row.creditsUsed,
      row.source,
      row.category,
      row.submittedBy,
      row.invitedMembers,
      row.invitedTechnicians,
      row.connectedInverters,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || haystack.includes(query);
    const matchesStatus =
      filters.status === "All" || row.status === filters.status;
    const matchesPriority =
      filters.priority === "All" || row.priority === filters.priority;
    const matchesRole = filters.role === "All" || row.role === filters.role;
    const matchesPlan = filters.plan === "All" || row.role === filters.plan;
    const matchesInterest = 
      filters.interest === "All" || row.role === filters.interest; 
    const matchesSource =
      filters.source === "All" || row.source === filters.source;
    const matchesInstallerType =
      filters.installerType === "All" ||
      row.installerType === filters.installerType;
    const matchesDate = dateMatchesPreset(row.date, filters.date, now);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesRole &&
      matchesPlan &&
      matchesInterest && 
      matchesSource &&
      matchesInstallerType && 
      matchesDate
    );
  });
}

function dateMatchesPreset(dateText: string, preset: string, now: Date) {
  if (preset === "All") return true;

  const parsedDate = parseSuperAdminDate(dateText);
  if (!parsedDate) return true;

  const days = (startOfDay(now).getTime() - startOfDay(parsedDate).getTime()) / 86_400_000;
  if (days < 0) return false;

  if (preset === "Last Month") return days <= 31;
  if (preset === "Last 3 Months") return days <= 93;
  if (preset === "Last 6 Months") return days <= 186;
  if (preset === "Last Year") return days <= 366;

  return true;
}

function parseSuperAdminDate(value: string) {
  if (value === "Today") return new Date();

  const slashDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashDate) {
    const [, day, month, year] = slashDate;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function useTableFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return { filters, updateFilter };
}

function ActionDialog({
  mode,
  open,
  onOpenChange,
  onAddAdmin,
}: {
  mode: DialogMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAdmin?: (row: SuperAdminTableRow) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");

  const close = () => {
    onOpenChange(false);
    setName("");
    setEmail("");
    setRole("Admin");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "admin") {
      onAddAdmin?.({
        id: `ADM-${Date.now().toString().slice(-4)}`,
        name: name || "New Admin",
        email: email || "admin@INTELL.africa",
        role,
        status: "Invited",
        date: "Today",
        meta: "Invitation pending",
      });
    }

    close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "admin"
              ? "Add Admin"
              : "Paid Users"}
          </DialogTitle>
          <DialogDescription>
            {mode === "paid-users"
              ? "Paid users will be connected to backend billing data when the endpoint is available."
              : "Use this temporary form to keep the super-admin UI flow functional before backend integration."}
          </DialogDescription>
        </DialogHeader>

        {mode === "paid-users" ? (
          <div className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
            Current dummy conversion is 10%, with 12 paid users from the pilot data.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-name">
                Full name
              </Label>
              <Input
                id="dialog-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Doe"
                className="h-11 text-sm placeholder:text-sm"
              />
            </div>

            <>
              <div className="space-y-2">
                <Label htmlFor="dialog-email">Email</Label>
                <Input
                  id="dialog-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@INTELL.africa"
                  className="h-11 text-sm placeholder:text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dialog-role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger
                    id="dialog-role"
                    className="h-11 rounded-lg border-border bg-card"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" className="bg-secondary text-white hover:bg-secondary/90">
                Save
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SuperAdminDashboardPage() {
  const { filters, updateFilter } = useTableFilters();
  const rows = filterRows(SUPER_ADMIN_DASHBOARD_ROWS, filters);

  return (
    <div className="space-y-7">
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUPER_ADMIN_METRICS.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {SUPER_ADMIN_OVERVIEW_CHARTS.slice(0, 2).map((chart) => (
          <ChartCard key={chart.title} {...chart} />
        ))}
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">New Users</h2>
        <SearchAndFilters
          planFilter
          filters={filters}
          onFilterChange={updateFilter}
        />
        <DataTable rows={rows} kind="dashboard" />
      </div>
    </div>
  );
}

export function SuperAdminAdminsPage() {
  const [tab, setTab] = useState<Tab>("list");
  const [rows, setRows] = useState(SUPER_ADMIN_ADMIN_ROWS);
  const [dialog, setDialog] = useState<DialogMode>(null);
  const { filters, updateFilter } = useTableFilters();
  const filteredRows = filterRows(rows, filters);

  return (
    <div>
      <PageHeader
        title="Admin Management"
        action={
          <Button
            onClick={() => setDialog("admin")}
            className="h-11 rounded-lg bg-secondary px-5 text-white hover:bg-secondary/90"
          >
            <Plus className="size-4" />
            Add Admin
          </Button>
        }
      />
      <SectionTabs value={tab} onChange={setTab} first="Admin List" />
      {tab === "activity" ? (
        <ActivityTable rows={SUPER_ADMIN_ACTIVITY_LOG} />
      ) : (
        <>
          <SearchAndFilters
            roleFilter
            filters={filters}
            onFilterChange={updateFilter}
          />
          <DataTable rows={filteredRows} kind="admins" />
        </>
      )}
      <ActionDialog
        mode={dialog}
        open={!!dialog}
        onOpenChange={(open) => setDialog(open ? dialog : null)}
        onAddAdmin={(row) => setRows((current) => [row, ...current])}
      />
    </div>
  );
}

export function SuperAdminUsersPage() {
  const [dialog, setDialog] = useState<DialogMode>(null);
  const { filters, updateFilter } = useTableFilters();
  const rows = filterRows(SUPER_ADMIN_USER_ROWS, filters);

  return (
    <div className="space-y-7">
      <PageHeader
        title="User Management"
        action={
          <Button
            variant="outline"
            onClick={() => setDialog("paid-users")}
            className="h-10 rounded-lg border-secondary text-secondary"
          >
            View Paid Users
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUPER_ADMIN_METRICS.slice(0, 2).map((metric) => ( 
          <StatCard key={metric.label} metric={metric} /> 
        ))}
        <StatCard key="Free Users" metric={SUPER_ADMIN_METRICS[2]} />
        <StatCard 
          metric={{ 
            label: "Paid Users", 
            value: "528", 
            helper: "Paid conversion from pilot users", 
            change: "+2.4% vs last month", 
            icon: Users,
          }}
        />
      </div>
      <SearchAndFilters
        planFilter
        filters={filters}
        onFilterChange={updateFilter}
      />
      <DataTable rows={rows} kind="users" />
      <ActionDialog
        mode={dialog}
        open={!!dialog}
        onOpenChange={(open) => setDialog(open ? dialog : null)}
      />
    </div>
  );
}

export function SuperAdminFeedbackPage() {
  const [tab, setTab] = useState<Tab>("list");
  const { filters, updateFilter } = useTableFilters();
  const rows = filterRows(SUPER_ADMIN_FEEDBACK_ROWS, filters);

  return (
    <div>
      <PageHeader title="Feedback Management" />
      <SectionTabs value={tab} onChange={setTab} first="Feedback" />
      {tab === "activity" ? (
        <ActivityTable rows={SUPER_ADMIN_ACTIVITY_LOG} />
      ) : (
        <>
          <SearchAndFilters filters={filters} onFilterChange={updateFilter} />
          <DataTable rows={rows} kind="feedback" />
        </>
      )}
    </div>
  );
}

export function SuperAdminCommunicationsPage() {
  const { filters, updateFilter } = useTableFilters();
  const filteredRows = filterRows(SUPER_ADMIN_COMMUNICATION_ROWS, filters);

  return (
    <div>
      <PageHeader
        title="Communications"
        action={
          <Button asChild className="h-11 rounded-lg bg-secondary px-5 text-white hover:bg-secondary/90">
            <Link href="/super-admin/communications/new">
              <Plus className="size-4" />
              New Broadcast
            </Link>
          </Button>
        }
      />
      <SearchAndFilters
        communicationFilter
        filters={filters}
        onFilterChange={updateFilter}
      />
      <DataTable rows={filteredRows} kind="communications" />
    </div>
  );
}

export function SuperAdminInstallersPage() {
  const { filters, updateFilter } = useTableFilters();
  const rows = filterRows(SUPER_ADMIN_INSTALLER_ROWS, filters);

  return (
    <div className="space-y-7">
      <PageHeader title="Installer Management" />
      <SearchAndFilters
        installerFilter
        filters={filters}
        onFilterChange={updateFilter}
      />
      <DataTable rows={rows} kind="installers" />
    </div>
  );
}

export function SuperAdminOnboardingLeadsPage() {
  const { filters, updateFilter } = useTableFilters();
  const rows = filterRows(SUPER_ADMIN_ONBOARDING_LEAD_ROWS, filters);

  return (
    <div className="space-y-7">
      <PageHeader title="Onboarding Leads" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"> 
        <StatCard 
          metric={{ 
            label: "Total Leads", 
            value: "43", 
            helper: "17 qualified leads need installer or sales follow-up", 
            change: "+18 from social campaigns", 
            icon: Users, 
          }} 
        /> 
        <StatCard 
          metric={{ 
            label: "Top State", 
            value: "Lagos",
            helper: "Largest demand source for the current campaign",
            change: "52% of new leads",
            icon: Users,
          }}
        />
        <StatCard
          metric={{
            label: "Top Interest", 
            value: "Home monitoring", 
            helper: "Most leads want INTELL for household inverter visibility", 
            change: "From onboard form selections", 
            icon: Users,
          }}
        />
      </div>
      <SearchAndFilters
        leadFilter
        filters={filters}
        onFilterChange={updateFilter}
      />
      <DataTable rows={rows} kind="onboarding-leads" />
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>
      <p className="max-w-[60%] text-right text-sm font-semibold text-foreground">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function DetailMetric({
  label,
  value,
  helper,
}: {
  label: string;
  value?: string;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
        {value || "0"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}

function DetailSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-lg border-border bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SuperAdminDetailPage({
  row,
  kind,
  backHref,
  title,
}: {
  row: SuperAdminTableRow;
  kind: SuperAdminRouteKey;
  backHref: string;
  title: string;
}) {
  const [status, setStatus] = useState(row.status);
  const [priority, setPriority] = useState<SuperAdminPriority>(
    row.priority ?? "-",
  );
  const canEdit = kind === "feedback";
  const initials =
    row.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "IN";
  const updateLabel =
    kind === "feedback" ? "Update Feedback" : "Update Account";

  return (
    <div className="space-y-6">
      <div>
          <Button asChild variant="ghost" className="-ml-3 mb-3 h-9 px-3">
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-xl font-semibold text-foreground">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{row.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {row.email || row.content || row.meta}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge status={status} />
                <PriorityBadge priority={priority} />
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground sm:text-right">
            <p className="font-medium text-foreground">{row.id}</p>
            <p>{row.date}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DetailMetric
          label="Amount Spent"
          value={row.amount}
          helper="Current tracked spend"
        />
        <DetailMetric
          label="Credits Used"
          value={row.creditsUsed}
          helper="AI credit consumption"
        />
        <DetailMetric
          label="Invited Members"
          value={row.invitedMembers}
          helper="People invited into this dashboard"
        />
        <DetailMetric
          label="Technicians Invited"
          value={row.invitedTechnicians}
          helper="Technicians granted inverter access"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Profile Details
          </h2>
          <div className="mt-4">
            <InfoItem label="Email" value={row.email} />
            <InfoItem label="Phone" value={row.phone} />
            <InfoItem label="State" value={row.state} />
            <InfoItem label="Inverter Type" value={row.inverterType} />
            <InfoItem label="Connected Inverters" value={row.connectedInverters} />
            <InfoItem label="Plan / Segment" value={row.role} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="text-lg font-semibold text-foreground">
            {canEdit ? "Workflow Update" : "Account Summary"}
          </h2>
          {canEdit ? (
            <div className="mt-4 space-y-4">
              <DetailSelect
                label="Status"
                value={status}
                options={SUPER_ADMIN_FILTER_OPTIONS.status.filter(
                  (option) => option !== "All",
                )}
                onChange={(value) => setStatus(value as typeof status)}
              />
              <DetailSelect
                label="Priority"
                value={priority}
                options={[
                  "-",
                  ...SUPER_ADMIN_FILTER_OPTIONS.priority.filter(
                    (option) => option !== "All",
                  ),
                ]}
                onChange={(value) => setPriority(value as SuperAdminPriority)}
              />
              <Button className="w-full bg-secondary text-white hover:bg-secondary/90">
                {updateLabel}
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <InfoItem label="Account Status" value={status} />
              <InfoItem label="Payment Status" value={row.role} />
              <InfoItem label="Last Activity" value={row.meta ?? row.date} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SuperAdminLeadDetailPage({
  row,
}: {
  row: SuperAdminTableRow;
}) {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3 h-9 px-3">
        <Link href="/super-admin/onboarding-leads">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Lead Details
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Details submitted from the public INTELL onboard form.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="grid gap-x-10 md:grid-cols-2">
          <InfoItem label="Full name" value={row.name} />
          <InfoItem label="Email" value={row.email} />
          <InfoItem label="Phone number" value={row.phone} />
          <InfoItem label="State" value={row.state} />
          <InfoItem label="Inverter type" value={row.inverterType} />
          <InfoItem label="Interest" value={row.role} />
          <InfoItem label="Source" value={row.source} />
          <InfoItem label="Submitted" value={row.date} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-foreground">Message</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {row.content || "No message was submitted."}
        </p>
      </div>
    </div>
  );
}

export function SuperAdminFeedbackDetailPage({
  row,
}: {
  row: SuperAdminTableRow;
}) {
  const [status, setStatus] = useState(row.status);
  const [priority, setPriority] = useState<SuperAdminPriority>(
    row.priority ?? "-",
  );

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3 h-9 px-3">
        <Link href="/super-admin/feedback">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Feedback Details
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          User-submitted feedback for product, reports, installer access, and
          energy monitoring workflows.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {row.category}
            </p>
            <h2 className="mt-2 text-xl font-bold text-foreground">
              {row.name}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {row.content}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={status} />
            <PriorityBadge priority={priority} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-base font-semibold text-foreground">
            Submission Details
          </h2>
          <div className="mt-4">
            <InfoItem label="Submitted by" value={row.submittedBy} />
            <InfoItem label="Email" value={row.email} />
            <InfoItem label="Category" value={row.category} />
            <InfoItem label="Submitted" value={row.date} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-base font-semibold text-foreground">
            Review Update
          </h2>
          <div className="mt-4 space-y-4">
            <DetailSelect
              label="Status"
              value={status}
              options={["Open", "In Progress", "Resolved"]}
              onChange={(value) => setStatus(value as typeof status)}
            />
            <DetailSelect
              label="Priority"
              value={priority}
              options={["-", "Low", "Medium", "High"]}
              onChange={(value) => setPriority(value as SuperAdminPriority)}
            />
            <Button className="w-full bg-secondary text-white hover:bg-secondary/90">
              Update Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuperAdminInstallerDetailPage({
  row,
}: {
  row: SuperAdminTableRow;
}) {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3 h-9 px-3">
        <Link href="/super-admin/installers">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {row.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{row.content}</p>
          </div>
          <StatusBadge status={row.status} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DetailMetric
          label="Installer Type"
          value={row.installerType}
          helper="Partner or invited technician"
        />
        <DetailMetric
          label="Users Managed"
          value={row.usersManaged}
          helper="Linked dashboard users"
        />
        <DetailMetric
          label="Managed Sites"
          value={row.sites}
          helper="Connected inverter locations"
        />
      </div>

      <div className="rounded-xl border border-border bg-white p-6">
        <h2 className="text-base font-semibold text-foreground">
          Installer Information
        </h2>
        <div className="mt-4 grid gap-x-10 md:grid-cols-2">
          <InfoItem label="Email" value={row.email} />
          <InfoItem label="Phone number" value={row.phone} />
          <InfoItem label="Company" value={row.company} />
          <InfoItem label="Region" value={row.region} />
          <InfoItem label="State" value={row.state} />
          <InfoItem label="Supported inverters" value={row.inverterType} />
          <InfoItem label="Account type" value={row.role} />
          <InfoItem label="Joined" value={row.date} />
        </div>
      </div>
    </div>
  );
}

export function SuperAdminCommunicationDetailPage({
  row,
}: {
  row: SuperAdminTableRow;
}) {
  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3 h-9 px-3">
        <Link href="/super-admin/communications">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <div className="rounded-xl border border-border bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Broadcast Message
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {row.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{row.content}</p>
          </div>
          <StatusBadge status={row.status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_0.75fr]">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-base font-semibold text-foreground">
            Message Body
          </h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {row.body}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="text-base font-semibold text-foreground">
            Delivery Setup
          </h2>
          <div className="mt-4">
            <InfoItem label="Audience" value={row.audience} />
            <InfoItem label="CTA label" value={row.actionLabel} />
            <InfoItem label="CTA URL" value={row.actionUrl} />
            <InfoItem label="Date" value={row.date} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuperAdminNewCommunicationPage() {
  const [audience, setAudience] = useState("Pilot users");
  const [ctaType, setCtaType] = useState("Open dashboard");

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3 h-9 px-3">
        <Link href="/super-admin/communications">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          New Broadcast
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Compose an operational update, launch announcement, or onboarding
          message for a defined INTELL audience.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <form className="space-y-5 rounded-xl border border-border bg-white p-6">
          <div className="space-y-2">
            <Label htmlFor="broadcast-subject">Subject</Label>
            <Input
              id="broadcast-subject"
              placeholder="Installer onboarding kit"
              className="h-11 text-sm placeholder:text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailSelect
              label="Audience"
              value={audience}
              options={[
                "Pilot users",
                "Installer partners",
                "Onboarding leads",
                "All users",
              ]}
              onChange={setAudience}
            />
            <DetailSelect
              label="Action Button"
              value={ctaType}
              options={[
                "Open dashboard",
                "Onboard now",
                "Follow social media",
                "Read update",
              ]}
              onChange={setCtaType}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="broadcast-url">Action URL</Label>
            <Input
              id="broadcast-url"
              placeholder="https://intell.ng/onboard"
              className="h-11 text-sm placeholder:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="broadcast-body">Message Body</Label>
            <Textarea
              id="broadcast-body"
              placeholder="Write the full broadcast message."
              className="min-h-64 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button className="bg-secondary text-white hover:bg-secondary/90">
              Save Broadcast
            </Button>
          </div>
        </form>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">
            Message Checklist
          </h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Confirm the audience is specific enough for the message.</p>
            <p>Keep the CTA aligned with the message intent.</p>
            <p>Use onboarding copy for leads and operational copy for users.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
