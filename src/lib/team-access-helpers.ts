import type { TeamAccessRole } from "@/types/team-access";

export function getRolePermissions(role: TeamAccessRole): string {
  if (role === "admin") return "Full access";
  if (role === "technician") return "System alerts and metrics only";
  return "Read-only access";
}

export function getRoleDashboards(role: TeamAccessRole): number {
  return role === "technician" ? 2 : 1;
}
