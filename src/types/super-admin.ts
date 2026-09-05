import type { LucideIcon } from "lucide-react";

export type SuperAdminRouteKey =
  | "dashboard"
  | "admins"
  | "users"
  | "installers"
  | "onboarding-leads"
  | "feedback"
  | "communications";

export type SuperAdminStatus =
  | "Active"
  | "Pending"
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Invited"
  | "Qualified"
  | "Contacted"
  | "Delivered"
  | "Draft"
  | "Scheduled"
  | "Failed";

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
  phone?: string;
  state?: string;
  inverterType?: string;
  company?: string;
  sites?: string;
  creditsUsed?: string;
  referrals?: string;
  source?: string;
  installerType?: string;
  usersManaged?: string;
  region?: string;
  actionLabel?: string;
  actionUrl?: string;
  audience?: string;
  body?: string;
  category?: string;
  submittedBy?: string;
  invitedMembers?: string;
  invitedTechnicians?: string;
  connectedInverters?: string;
}

export interface SuperAdminActivity {
  id: string;
  action: string;
  date: string;
}
