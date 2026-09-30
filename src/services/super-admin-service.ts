import {
  apiFetch,
  apiFetchEnvelope,
  type ApiPaginationMeta,
} from "@/lib/api/client";
import { useSuperAdminAuthStore } from "@/stores/super-admin-auth-store";
import type {
  ChartPeriod,
  ChartResponse,
  FeedbackPriority,
  FeedbackRecord,
  FeedbackStatus,
  FeedbackSummary,
  InstallerProfileRecord,
  InstallerStatus,
  InstallerSummary,
  InstallerType,
  OnboardingLeadRecord,
  OnboardingLeadStatus,
  OnboardingLeadSummary,
  PaginatedResult,
  SuperAdminDashboardSummary,
  SuperAdminUser,
} from "@/types/super-admin-api";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

function authHeaders() {
  const token = useSuperAdminAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

function toQuery(params: QueryParams = {}) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || value === "all") {
      continue;
    }
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

async function list<T>(path: string, params?: QueryParams): Promise<PaginatedResult<T>> {
  const envelope = await apiFetchEnvelope<T[]>(
    `${path}${toQuery(params)}`,
    { method: "GET", headers: authHeaders() },
    true,
  );

  return {
    data: envelope.data ?? [],
    pagination: envelope.meta?.pagination ?? ({} satisfies ApiPaginationMeta),
  };
}

function get<T>(path: string, params?: QueryParams) {
  return apiFetch<T>(
    `${path}${toQuery(params)}`,
    { method: "GET", headers: authHeaders() },
    true,
  );
}

function patch<T>(path: string, data: unknown) {
  return apiFetch<T>(
    path,
    { method: "PATCH", data, headers: authHeaders() },
    true,
  );
}

function post<T>(path: string, data: unknown) {
  return apiFetch<T>(
    path,
    { method: "POST", data, headers: authHeaders() },
    true,
  );
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const SuperAdminService = {
  getDashboardSummary: () =>
    get<SuperAdminDashboardSummary>("/super-admin/dashboard/summary"),
  getUsersChart: (period: ChartPeriod = "monthly") =>
    get<ChartResponse>("/super-admin/dashboard/users-chart", { period }),
  getAiUsageChart: (period: ChartPeriod = "monthly") =>
    get<ChartResponse>("/super-admin/dashboard/ai-usage-chart", { period }),
  getRecentUsers: (params: ListParams = {}) =>
    list<SuperAdminUser>("/super-admin/dashboard/recent-users", params),
  listAdmins: (params: ListParams & { role?: string; status?: string } = {}) =>
    list<SuperAdminUser>("/super-admin/admins", params),
  createAdmin: (data: {
    firstName: string;
    lastName: string;
    email: string;
    role: "admin" | "super_admin";
  }) => post<SuperAdminUser>("/super-admin/admins", data),
  listUsers: (
    params: ListParams & { plan?: string; status?: string; state?: string } = {},
  ) => list<SuperAdminUser>("/super-admin/users", params),
  getUser: (id: string) => get<SuperAdminUser>(`/super-admin/users/${id}`),
  listInstallers: (
    params: ListParams & {
      type?: InstallerType;
      status?: InstallerStatus;
      state?: string;
      brand?: string;
    } = {},
  ) => list<InstallerProfileRecord>("/super-admin/installers", params),
  getInstallersSummary: () =>
    get<InstallerSummary>("/super-admin/installers/summary"),
  getInstaller: (id: string) =>
    get<InstallerProfileRecord>(`/super-admin/installers/${id}`),
  updateInstallerStatus: (
    id: string,
    data: { status: InstallerStatus; reason?: string },
  ) => patch<InstallerProfileRecord>(`/super-admin/installers/${id}/status`, data),
};

export const OnboardingLeadsService = {
  create: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    state: string;
    inverterType: string;
    interest: string;
    source: string;
    message?: string;
  }) => apiFetch<OnboardingLeadRecord>("/onboarding-leads", { method: "POST", data }, true),
  list: (
    params: ListParams & {
      status?: OnboardingLeadStatus;
      interest?: string;
      source?: string;
      state?: string;
      inverterType?: string;
    } = {},
  ) => list<OnboardingLeadRecord>("/super-admin/onboarding-leads", params),
  getSummary: () =>
    get<OnboardingLeadSummary>("/super-admin/onboarding-leads/summary"),
  get: (id: string) =>
    get<OnboardingLeadRecord>(`/super-admin/onboarding-leads/${id}`),
  updateStatus: (id: string, status: OnboardingLeadStatus) =>
    patch<OnboardingLeadRecord>(`/super-admin/onboarding-leads/${id}/status`, {
      status,
    }),
};

export const FeedbackService = {
  list: (
    params: ListParams & {
      status?: FeedbackStatus;
      priority?: FeedbackPriority;
      category?: string;
      startDate?: string;
      endDate?: string;
    } = {},
  ) => list<FeedbackRecord>("/super-admin/feedback", params),
  getSummary: () => get<FeedbackSummary>("/super-admin/feedback/summary"),
  get: (id: string) => get<FeedbackRecord>(`/super-admin/feedback/${id}`),
  update: (
    id: string,
    data: {
      status?: FeedbackStatus;
      priority?: FeedbackPriority;
      adminNote?: string;
    },
  ) => patch<FeedbackRecord>(`/super-admin/feedback/${id}`, data),
};

export const InstallerAdminService = {
  list: SuperAdminService.listInstallers,
  getSummary: SuperAdminService.getInstallersSummary,
  get: SuperAdminService.getInstaller,
  updateStatus: SuperAdminService.updateInstallerStatus,
};
