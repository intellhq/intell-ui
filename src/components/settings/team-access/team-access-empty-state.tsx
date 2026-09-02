import { UsersRound } from "lucide-react";

export function TeamAccessEmptyState() {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-4 rounded-2xl border px-6 py-14 text-center">
      <div className="bg-muted flex size-14 items-center justify-center rounded-full">
        <UsersRound className="text-muted-foreground size-6" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-foreground text-lg font-semibold">
          No team members yet
        </h3>
        <p className="text-muted-foreground text-sm">
          Invite your first admin, technician, or viewer to start sharing dashboard access.
        </p>
      </div>
    </div>
  );
}

