import type { ApiPaginationMeta } from "@/lib/api/client";

export type FeedbackStatus = "open" | "in_progress" | "resolved";
export type FeedbackPriority = "low" | "medium" | "high";
export type OnboardingLeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "closed";
export type InstallerType = "partner" | "technician";
export type InstallerStatus = "pending" | "active" | "suspended";
export type ChartPeriod = "weekly" | "monthly" | "yearly";

export interface PaginatedResult<T> {
  data: T[];
  pagination: ApiPaginationMeta;
}

export interface SuperAdminDashboardSummary {
  users: { total: number; newThisMonth: number; free: number; paid: number };
  installers: { total: number; partners: number; technicians: number };
  leads: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
  };
  feedback: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
  };
  aiUsage: { inputTokens: number; outputTokens: number; totalTokens: number };
}

export interface ChartPoint {
  label?: string;
  period?: string;
  date?: string;
  free?: number;
  paid?: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export interface ChartResponse {
  period: ChartPeriod;
  points: ChartPoint[];
}

export interface SuperAdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  adminStatus?: string | null;
  isActive?: boolean;
  emailVerified?: boolean;
  onboardingComplete?: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string | null;
  inverterBrand?: string | null;
  settings?: {
    state?: string | null;
    city?: string | null;
    businessName?: string | null;
    businessType?: string | null;
  };
}

export interface FeedbackRecord {
  id: string;
  userId?: string | null;
  name?: string | null;
  email?: string | null;
  category: string;
  priority: FeedbackPriority;
  message: string;
  status: FeedbackStatus;
  adminNote?: string | null;
  resolvedAt?: string | null;
  resolvedByAdminId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  highPriority: number;
}

export interface OnboardingLeadRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  state: string;
  inverterType: string;
  interest: string;
  source: string;
  message?: string | null;
  status: OnboardingLeadStatus;
  assignedAdminId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingLeadSummary {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  closed: number;
}

export interface InstallerProfileRecord {
  id: string;
  userId: string;
  type: InstallerType;
  companyName?: string | null;
  contactName: string;
  email: string;
  phoneNumber?: string | null;
  state?: string | null;
  region?: string | null;
  supportedBrands: string[];
  status: InstallerStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  assignments?: Array<{ id: string; status: string }>;
}

export interface InstallerSummary {
  total: number;
  partners: number;
  technicians: number;
  pending: number;
  active: number;
  suspended: number;
}
