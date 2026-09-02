"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LockKeyhole, Plus, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { TeamAccessInviteDialog } from "./team-access-invite-dialog";
import { TeamAccessStatsCards } from "./team-access-stats";
import { TeamAccessEmptyState } from "./team-access-empty-state";
import { TeamAccessTable } from "./team-access-table";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { getRoleDashboards, getRolePermissions } from "@/lib/team-access-helpers";
import { useAuthStore } from "@/stores/auth-store";
import { teamAccessService } from "@/services/team-access-service";
import type {
  ApiInverterMember,
  ApiTeamAccessRole,
  TeamAccessRole,
  TeamMember,
} from "@/types/team-access";

const ROLE_LABELS: Record<TeamAccessRole, string> = {
  admin: "Admin",
  technician: "Technician",
  viewer: "Viewer",
};

const UI_TO_API_ROLE: Record<TeamAccessRole, ApiTeamAccessRole> = {
  admin: "inverter_admin",
  technician: "inverter_technician",
  viewer: "inverter_viewer",
};

function getUiRole(role: ApiInverterMember["role"]): TeamAccessRole {
  if (role === "inverter_admin") return "admin";
  if (role === "inverter_technician") return "technician";
  return "viewer";
}

function deriveNames(member: ApiInverterMember) {
  const firstName = member.user?.firstName?.trim();
  const lastName = member.user?.lastName?.trim();

  if (firstName || lastName) {
    return {
      firstName: firstName || "Invited",
      lastName: lastName || "User",
    };
  }

  const localPart = member.email.split("@")[0] ?? "Invited User";
  const parts = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

  return {
    firstName: parts[0] || "Invited",
    lastName: parts.slice(1).join(" ") || "User",
  };
}

function mapMember(member: ApiInverterMember): TeamMember {
  const role = getUiRole(member.role);
  const names = deriveNames(member);

  return {
    id: member.id,
    inverterId: member.inverterId,
    userId: member.userId,
    firstName: names.firstName,
    lastName: names.lastName,
    email: member.email,
    role,
    status:
      member.status === "invited"
        ? "pending"
        : member.status === "deactivated"
          ? "disabled"
          : "active",
    permissions: getRolePermissions(role),
    dashboards: getRoleDashboards(role),
    invitedAt: member.createdAt,
    inviteToken: member.inviteToken,
    inviteTokenExpiresAt: member.inviteTokenExpiresAt,
  };
}

function canManageInverter(role: string | undefined) {
  return role === "inverter_owner" || role === "inverter_admin";
}

export function TeamAccessPageClient() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const inverterAccess = useAuthStore((state) => state.inverterAccess);
  const queryClient = useQueryClient();
  const { useUserInverters } = useInverterQueries();
  const { data: inverters, isLoading: isInvertersLoading } = useUserInverters();

  const selectedInverterId = inverters?.[0]?.id;
  const currentRole = inverterAccess.find(
    (entry) => entry.inverterId === selectedInverterId,
  )?.role;
  const canManageTeam = canManageInverter(currentRole);

  const membersQuery = useQuery({
    queryKey: ["team-access-members", selectedInverterId],
    queryFn: async () => {
      const data = await teamAccessService.listMembers(selectedInverterId!);
      return data.map(mapMember);
    },
    enabled: Boolean(selectedInverterId && canManageTeam),
  });

  const members = membersQuery.data ?? [];

  const stats = {
    totalUsers: members.length,
    admins: members.filter((member) => member.role === "admin").length,
    technicians: members.filter((member) => member.role === "technician").length,
    viewers: members.filter((member) => member.role === "viewer").length,
  };

  const inviteMutation = useMutation({
    mutationFn: (payload: {
      email: string;
      role: TeamAccessRole;
      firstName: string;
    }) =>
      teamAccessService.inviteMember(selectedInverterId!, {
        email: payload.email,
        role: UI_TO_API_ROLE[payload.role],
      }),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["team-access-members", selectedInverterId],
      });
      setInviteModalOpen(false);
      toast.success(`Invitation sent to ${variables.firstName}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to send invite");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: TeamAccessRole }) =>
      teamAccessService.updateMemberRole(
        selectedInverterId!,
        memberId,
        UI_TO_API_ROLE[role],
      ),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["team-access-members", selectedInverterId],
      });
      toast.success(`${ROLE_LABELS[variables.role]} access updated`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (memberId: string) =>
      teamAccessService.revokeMemberAccess(selectedInverterId!, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["team-access-members", selectedInverterId],
      });
      toast.success("Team member removed");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to revoke access");
    },
  });

  const isLoading = isInvertersLoading || membersQuery.isLoading;

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Team & Access" },
        ]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Team Management & Access Control
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage users, assign specific system roles, and control administrative access levels.
          </p>
        </div>
        <Button
          onClick={() => setInviteModalOpen(true)}
          disabled={!selectedInverterId || !canManageTeam}
          className="h-12 w-full bg-black hover:bg-black lg:w-auto"
        >
          <Plus className="size-4" />
          Add New User
        </Button>
      </div>

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : !selectedInverterId ? (
        <div className="rounded-xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
          No inverter found for this account yet.
        </div>
      ) : !canManageTeam ? (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6]">
                <ShieldAlert className="size-5 text-[#111827]" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <LockKeyhole className="size-3.5" />
                  Restricted access
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-foreground">
                    Team management is limited on this inverter
                  </h2>
                  <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    Only the inverter owner or an admin can invite users, change roles, and revoke access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : membersQuery.isError ? (
        <div className="rounded-xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
          Unable to load the team list right now.
        </div>
      ) : (
        <>
          <TeamAccessStatsCards stats={stats} />

          {members.length === 0 ? (
            <TeamAccessEmptyState />
          ) : (
            <TeamAccessTable
              members={members}
              onEditRole={(memberId, role) =>
                updateRoleMutation.mutate({ memberId, role })
              }
              onRemove={(memberId) => revokeMutation.mutate(memberId)}
            />
          )}
        </>
      )}

      <TeamAccessInviteDialog
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onInvite={(values) => inviteMutation.mutate(values)}
      />
    </div>
  );
}
