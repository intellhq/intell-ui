import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getRoleDashboards, getRolePermissions } from "@/lib/team-access-helpers";
import type { TeamAccessRole, TeamMember } from "@/types/team-access";

const TEAM_ACCESS_STORAGE_KEY = "energy-iq-team-access";

const initialMembers: TeamMember[] = [
  {
    id: "member-1",
    inverterId: "inverter-1",
    userId: "user-1",
    firstName: "Amaka",
    lastName: "Okeke",
    email: "amaka@energyiq.africa",
    role: "admin",
    status: "active",
    permissions: "Full access",
    dashboards: 3,
    invitedAt: "2026-06-18T09:30:00.000Z",
  },
  {
    id: "member-2",
    inverterId: "inverter-1",
    userId: "user-2",
    firstName: "Tunde",
    lastName: "Bakare",
    email: "tunde@energyiq.africa",
    role: "technician",
    status: "active",
    permissions: "System alerts and metrics only",
    dashboards: 2,
    invitedAt: "2026-06-20T11:10:00.000Z",
  },
  {
    id: "member-3",
    inverterId: "inverter-1",
    userId: "user-3",
    firstName: "Chidi",
    lastName: "Obi",
    email: "chidi@energyiq.africa",
    role: "viewer",
    status: "active",
    permissions: "Read-only access",
    dashboards: 1,
    invitedAt: "2026-06-21T15:00:00.000Z",
  },
];

interface TeamAccessState {
  members: TeamMember[];
  inviteModalOpen: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;
  inviteMember: (member: {
    firstName: string;
    lastName: string;
    email: string;
    role: TeamAccessRole;
  }) => void;
  removeMember: (id: string) => void;
  updateRole: (id: string, role: TeamAccessRole) => void;
  resetMembers: () => void;
}

export const useTeamAccessStore = create<TeamAccessState>()(
  persist(
    (set) => ({
      members: initialMembers,
      inviteModalOpen: false,
      openInviteModal: () => set({ inviteModalOpen: true }),
      closeInviteModal: () => set({ inviteModalOpen: false }),
      inviteMember: (member) =>
        set((state) => ({
          members: [
            {
              ...member,
              inverterId: "inverter-1",
              userId: null,
              status: "pending",
              permissions: getRolePermissions(member.role),
              dashboards: getRoleDashboards(member.role),
              id: `member-${Date.now()}`,
              invitedAt: new Date().toISOString(),
            },
            ...state.members,
          ],
          inviteModalOpen: false,
        })),
      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((member) => member.id !== id),
        })),
      updateRole: (id, role) =>
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id
              ? {
                  ...member,
                  role,
                  permissions: getRolePermissions(role),
                  dashboards: getRoleDashboards(role),
                }
              : member,
          ),
        })),
      resetMembers: () => set({ members: initialMembers }),
    }),
    {
      name: TEAM_ACCESS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ members: state.members }),
    },
  ),
);

