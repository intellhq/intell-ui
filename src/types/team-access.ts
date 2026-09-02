export const TEAM_ACCESS_ROLES = ["admin", "technician", "viewer"] as const;
export type TeamAccessRole = (typeof TEAM_ACCESS_ROLES)[number];

export const API_TEAM_ACCESS_ROLES = [
  "inverter_admin",
  "inverter_technician",
  "inverter_viewer",
] as const;
export type ApiTeamAccessRole = (typeof API_TEAM_ACCESS_ROLES)[number];

export type TeamAccessStatus = "active" | "pending" | "disabled";
export type ApiTeamAccessStatus = "active" | "invited" | "deactivated";

export interface TeamMember {
  id: string;
  inverterId: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamAccessRole;
  status: TeamAccessStatus;
  permissions: string;
  dashboards: number;
  invitedAt: string;
  inviteToken?: string;
  inviteTokenExpiresAt?: string | null;
}

export interface ApiInverterMember {
  id: string;
  inverterId: string;
  userId: string | null;
  email: string;
  role: ApiTeamAccessRole | "inverter_owner";
  status: ApiTeamAccessStatus;
  invitedById: string;
  inviteToken: string;
  inviteTokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
}

export interface TeamAccessStats {
  totalUsers: number;
  admins: number;
  technicians: number;
  viewers: number;
}
