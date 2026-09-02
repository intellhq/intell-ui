import { apiFetch } from "@/lib/api/client";
import type { ApiInverterMember, ApiTeamAccessRole } from "@/types/team-access";

export const teamAccessService = {
  listMembers: async (inverterId: string) => {
    return apiFetch<ApiInverterMember[]>(
      `/team-access/${inverterId}`,
      { method: "GET" },
      true,
    );
  },

  inviteMember: async (
    inverterId: string,
    data: { email: string; role: ApiTeamAccessRole },
  ) => {
    return apiFetch<ApiInverterMember>(
      `/team-access/${inverterId}/invite`,
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  updateMemberRole: async (
    inverterId: string,
    memberId: string,
    role: ApiTeamAccessRole,
  ) => {
    return apiFetch<ApiInverterMember>(
      `/team-access/${inverterId}/${memberId}`,
      {
        method: "PATCH",
        data: { role },
      },
      true,
    );
  },

  revokeMemberAccess: async (inverterId: string, memberId: string) => {
    return apiFetch<void>(
      `/team-access/${inverterId}/${memberId}`,
      { method: "DELETE" },
      true,
    );
  },

  refreshInvite: async (inverterId: string, inviteId: string) => {
    return apiFetch<ApiInverterMember>(
      `/team-access/${inverterId}/invites/${inviteId}/refresh`,
      { method: "POST" },
      true,
    );
  },

  getPendingInvites: async () => {
    return apiFetch<ApiInverterMember[]>(
      "/team-access/invites",
      { method: "GET" },
      true,
    );
  },

  getMemberships: async () => {
    return apiFetch<ApiInverterMember[]>(
      "/team-access/memberships",
      { method: "GET" },
      true,
    );
  },
};
