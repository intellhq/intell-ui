"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SUPER_ADMIN_ACTIVITY_LOG,
  SUPER_ADMIN_ADMIN_ROWS,
  SUPER_ADMIN_COMMUNICATION_ROWS,
  SUPER_ADMIN_DASHBOARD_ROWS,
  SUPER_ADMIN_FEEDBACK_ROWS,
  SUPER_ADMIN_FILTER_OPTIONS,
  SUPER_ADMIN_METRICS,
  SUPER_ADMIN_OVERVIEW_CHARTS,
  SUPER_ADMIN_SUPPORT_ROWS,
  SUPER_ADMIN_USER_ROWS,
} from "@/constants/super-admin";
import type {
  SuperAdminActivity,
  SuperAdminMetric,
  SuperAdminPriority,
  SuperAdminTableRow,
} from "@/types/super-admin";
import { cn } from "@/lib/utils";

type Tab = "list" | "activity";
type DialogMode = "admin" | "message" | "paid-users" | null;
type FilterState = {
  search: string;
  status: string;
  priority: string;
  role: string;
  plan: string;
  date: string;
};

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "All",
  priority: "All",
  role: "All",
  plan: "All",
  date: "All",
};

function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
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
    <DropdownMenu className="min-w-0">
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full min-w-0 justify-between gap-2 rounded-lg border-border bg-card px-3 text-muted-foreground sm:w-auto sm:min-w-36"
        >
          <span className="flex min-w-0 items-center gap-2">
            {label === "Date" ? (
              <Calendar className="size-4 shrink-0" />
            ) : (
              <Filter className="size-4 shrink-0" />
            )}
            <span className="truncate">{value === "All" ? label : value}</span>
          </span>
          <ChevronDown className="size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onChange(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchAndFilters({
  roleFilter,
  planFilter,
  filters,
  onFilterChange,
}: {
  roleFilter?: boolean;
  planFilter?: boolean;
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

function DataTable({
  rows,
  kind,
}: {
  rows: SuperAdminTableRow[];
  kind: "admins" | "users" | "feedback" | "support" | "communications" | "dashboard";
}) {
  const columns = useMemo(() => {
    if (kind === "admins") return ["Name", "Email", "Role", "Status", "Date Added"];
    if (kind === "users")
      return ["Users", "Account Status", "Payment Status", "Last Log-in", "Amount Spent"];
    if (kind === "dashboard")
      return ["Users", "Account Status", "Payment Status", "Registration Date", "Amount Spent"];
    if (kind === "communications")
      return ["ID", "Message", "Status", "Priority", "Date"];
    return ["ID", kind === "feedback" ? "Feedback content" : "Submitted by", "Status", "Priority", "Date Submitted"];
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
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                {kind === "admins" ? (
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
                    <td className="px-5 py-4 text-muted-foreground">{row.email}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.role}</td>
                    <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-4 text-muted-foreground">{row.date}</td>
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
                ) : (
                  <>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-foreground">{row.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="mt-1 max-w-md truncate text-muted-foreground">{row.content}</p>
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-4"><PriorityBadge priority={row.priority} /></td>
                    <td className="px-5 py-4 text-muted-foreground">{row.date}</td>
                  </>
                )}
              </tr>
            ))}
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
  icon: Icon,
}: (typeof SUPER_ADMIN_OVERVIEW_CHARTS)[number]) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="relative h-56 overflow-hidden rounded-lg border border-border bg-muted/20 p-4">
        <div className="absolute inset-4 grid grid-rows-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="border-t border-dashed border-border" />
          ))}
        </div>
        <div className="absolute inset-x-5 bottom-5 top-8 flex items-end gap-2 sm:gap-3">
          {input.map((inputValue, index) => (
            <div key={index} className="flex flex-1 items-end justify-center gap-1">
              <div
                className="h-full w-full max-w-4 rounded-t bg-secondary/80"
                style={{ height: `${Math.max(inputValue, 8)}%` }}
                title={`input ${inputValue}`}
              />
              <div
                className="h-full w-full max-w-4 rounded-t bg-chart-battery"
                style={{ height: `${Math.max(output[index] ?? 0, 8)}%` }}
                title={`output ${output[index] ?? 0}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-secondary" />
          input
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-chart-battery" />
          output
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
    const matchesDate = dateMatchesPreset(row.date, filters.date, now);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesRole &&
      matchesPlan &&
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
  onAddMessage,
}: {
  mode: DialogMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAdmin?: (row: SuperAdminTableRow) => void;
  onAddMessage?: (row: SuperAdminTableRow) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [message, setMessage] = useState("");

  const close = () => {
    onOpenChange(false);
    setName("");
    setEmail("");
    setRole("Admin");
    setMessage("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "admin") {
      onAddAdmin?.({
        id: `ADM-${Date.now().toString().slice(-4)}`,
        name: name || "New Admin",
        email: email || "admin@energyiq.africa",
        role,
        status: "Invited",
        date: "Today",
        meta: "Invitation pending",
      });
    }

    if (mode === "message") {
      onAddMessage?.({
        id: `COM-${Date.now().toString().slice(-4)}`,
        name: name || "New communication",
        content: message || "Draft communication for Energy IQ users.",
        status: "Pending",
        priority: "Medium",
        date: "Today",
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
              : mode === "message"
                ? "New Message"
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
                {mode === "message" ? "Message title" : "Full name"}
              </Label>
              <Input
                id="dialog-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={mode === "message" ? "Launch update" : "Jane Doe"}
              />
            </div>

            {mode === "admin" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dialog-email">Email</Label>
                  <Input
                    id="dialog-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@energyiq.africa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dialog-role">Role</Label>
                  <select
                    id="dialog-role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm"
                  >
                    <option>Admin</option>
                    <option>Super Admin</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="dialog-message">Message</Label>
                <Input
                  id="dialog-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="What should this communication say?"
                />
              </div>
            )}

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
        {SUPER_ADMIN_METRICS.slice(0, 3).map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
        <StatCard
          metric={{
            label: "Free vs Paid Users",
            value: "10%",
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

export function SuperAdminSupportPage() {
  const [tab, setTab] = useState<Tab>("list");
  const { filters, updateFilter } = useTableFilters();
  const rows = filterRows(SUPER_ADMIN_SUPPORT_ROWS, filters);

  return (
    <div>
      <PageHeader title="Customer Support" />
      <SectionTabs value={tab} onChange={setTab} first="Email List" />
      {tab === "activity" ? (
        <ActivityTable rows={SUPER_ADMIN_ACTIVITY_LOG} />
      ) : (
        <>
          <SearchAndFilters filters={filters} onFilterChange={updateFilter} />
          <DataTable rows={rows} kind="support" />
        </>
      )}
    </div>
  );
}

export function SuperAdminCommunicationsPage() {
  const [rows, setRows] = useState(SUPER_ADMIN_COMMUNICATION_ROWS);
  const [dialog, setDialog] = useState<DialogMode>(null);
  const { filters, updateFilter } = useTableFilters();
  const filteredRows = filterRows(rows, filters);

  return (
    <div>
      <PageHeader
        title="Communications"
        action={
          <Button
            onClick={() => setDialog("message")}
            className="h-11 rounded-lg bg-secondary px-5 text-white hover:bg-secondary/90"
          >
            <Plus className="size-4" />
            New Message
          </Button>
        }
      />
      <SearchAndFilters filters={filters} onFilterChange={updateFilter} />
      <DataTable rows={filteredRows} kind="communications" />
      <ActionDialog
        mode={dialog}
        open={!!dialog}
        onOpenChange={(open) => setDialog(open ? dialog : null)}
        onAddMessage={(row) => setRows((current) => [row, ...current])}
      />
    </div>
  );
}
