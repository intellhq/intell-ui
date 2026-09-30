import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FeedbackService,
  OnboardingLeadsService,
  SuperAdminService,
  type ListParams,
} from "@/services/super-admin-service";
import type {
  FeedbackPriority,
  FeedbackStatus,
  InstallerStatus,
  InstallerType,
  OnboardingLeadStatus,
} from "@/types/super-admin-api";
import { useSuperAdminAuthStore } from "@/stores/super-admin-auth-store";

export const superAdminKeys = {
  root: ["super-admin"] as const,
  summary: () => [...superAdminKeys.root, "summary"] as const,
  usersChart: () => [...superAdminKeys.root, "users-chart"] as const,
  aiUsageChart: () => [...superAdminKeys.root, "ai-usage-chart"] as const,
  recentUsers: (params: ListParams) =>
    [...superAdminKeys.root, "recent-users", params] as const,
  admins: (params: ListParams) => [...superAdminKeys.root, "admins", params] as const,
  users: (params: ListParams) => [...superAdminKeys.root, "users", params] as const,
  user: (id: string) => [...superAdminKeys.root, "users", id] as const,
  installersSummary: () => [...superAdminKeys.root, "installers-summary"] as const,
  installers: (params: ListParams) =>
    [...superAdminKeys.root, "installers", params] as const,
  installer: (id: string) => [...superAdminKeys.root, "installers", id] as const,
  leadsSummary: () => [...superAdminKeys.root, "leads-summary"] as const,
  leads: (params: ListParams) => [...superAdminKeys.root, "leads", params] as const,
  lead: (id: string) => [...superAdminKeys.root, "leads", id] as const,
  feedbackSummary: () => [...superAdminKeys.root, "feedback-summary"] as const,
  feedback: (params: ListParams) =>
    [...superAdminKeys.root, "feedback", params] as const,
  feedbackDetail: (id: string) => [...superAdminKeys.root, "feedback", id] as const,
};

function useCanFetchSuperAdmin() {
  return useSuperAdminAuthStore((state) => state.isAuthenticated && !!state.token);
}

export function useSuperAdminSummary() {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.summary(),
    queryFn: SuperAdminService.getDashboardSummary,
    enabled,
  });
}

export function useSuperAdminUsersChart() {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.usersChart(),
    queryFn: () => SuperAdminService.getUsersChart(),
    enabled,
  });
}

export function useSuperAdminAiUsageChart() {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.aiUsageChart(),
    queryFn: () => SuperAdminService.getAiUsageChart(),
    enabled,
  });
}

export function useSuperAdminRecentUsers(params: ListParams) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.recentUsers(params),
    queryFn: () => SuperAdminService.getRecentUsers(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useSuperAdminUsers(
  params: ListParams & { plan?: string; status?: string; state?: string },
) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.users(params),
    queryFn: () => SuperAdminService.listUsers(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useSuperAdminUser(id: string) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.user(id),
    queryFn: () => SuperAdminService.getUser(id),
    enabled: enabled && !!id,
  });
}

export function useSuperAdminAdmins(params: ListParams & { role?: string; status?: string }) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.admins(params),
    queryFn: () => SuperAdminService.listAdmins(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useCreateSuperAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SuperAdminService.createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superAdminKeys.root });
      toast.success("Admin invited successfully.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to invite admin.");
    },
  });
}

export function useSuperAdminInstallers(
  params: ListParams & {
    type?: InstallerType;
    status?: InstallerStatus;
    state?: string;
    brand?: string;
  },
) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.installers(params),
    queryFn: () => SuperAdminService.listInstallers(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useSuperAdminInstallersSummary() {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.installersSummary(),
    queryFn: SuperAdminService.getInstallersSummary,
    enabled,
  });
}

export function useSuperAdminInstaller(id: string) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.installer(id),
    queryFn: () => SuperAdminService.getInstaller(id),
    enabled: enabled && !!id,
  });
}

export function useUpdateInstallerStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: InstallerStatus) =>
      SuperAdminService.updateInstallerStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superAdminKeys.root });
      toast.success("Installer status updated.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to update installer.");
    },
  });
}

export function useSuperAdminLeads(
  params: ListParams & {
    status?: OnboardingLeadStatus;
    interest?: string;
    source?: string;
    state?: string;
    inverterType?: string;
  },
) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.leads(params),
    queryFn: () => OnboardingLeadsService.list(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useSuperAdminLeadsSummary() {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.leadsSummary(),
    queryFn: OnboardingLeadsService.getSummary,
    enabled,
  });
}

export function useSuperAdminLead(id: string) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.lead(id),
    queryFn: () => OnboardingLeadsService.get(id),
    enabled: enabled && !!id,
  });
}

export function useUpdateLeadStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: OnboardingLeadStatus) =>
      OnboardingLeadsService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superAdminKeys.root });
      toast.success("Lead status updated.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to update lead.");
    },
  });
}

export function useSuperAdminFeedback(
  params: ListParams & {
    status?: FeedbackStatus;
    priority?: FeedbackPriority;
    category?: string;
    startDate?: string;
    endDate?: string;
  },
) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.feedback(params),
    queryFn: () => FeedbackService.list(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useSuperAdminFeedbackSummary() {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.feedbackSummary(),
    queryFn: FeedbackService.getSummary,
    enabled,
  });
}

export function useSuperAdminFeedbackDetail(id: string) {
  const enabled = useCanFetchSuperAdmin();
  return useQuery({
    queryKey: superAdminKeys.feedbackDetail(id),
    queryFn: () => FeedbackService.get(id),
    enabled: enabled && !!id,
  });
}

export function useUpdateFeedback(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      status?: FeedbackStatus;
      priority?: FeedbackPriority;
      adminNote?: string;
    }) => FeedbackService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superAdminKeys.root });
      toast.success("Feedback updated.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to update feedback.");
    },
  });
}
