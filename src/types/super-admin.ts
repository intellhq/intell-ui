import type { LucideIcon } from "lucide-react";

export type SuperAdminRouteKey =
  | "dashboard"
  | "admins"
  | "users"
  | "feedback"
  | "customer-support"
  | "communications";

export type SuperAdminStatus =
  | "Active"
  | "Pending"
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Invited";

export type SuperAdminPriority = "Low" | "Medium" | "High" | "-";

export interface SuperAdminNavItem {
  key: SuperAdminRouteKey;
  label: string;
  href: string;
}

export interface SuperAdminMetric {
  label: string;
  value: string;
  helper: string;
  change?: string;
  icon: LucideIcon;
}

export interface SuperAdminTableRow {
  id: string;
  name: string;
  email?: string;
  content?: string;
  role?: string;
  status: SuperAdminStatus;
  priority?: SuperAdminPriority;
  date: string;
  meta?: string;
  amount?: string;
}

export interface SuperAdminActivity {
  id: string;
  action: string;
  date: string;
}
