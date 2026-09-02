"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { AuthService } from "@/services/auth-service";
import { ProfileService } from "@/services/profile-service";
import { useAuthStore } from "@/stores/auth-store";
import { InverterAccess, User } from "@/types/auth";

function normalizeMePayload(payload: unknown): {
  user: User | null;
  inverterAccess: InverterAccess[];
} {
  if (!payload || typeof payload !== "object") {
    return { user: null, inverterAccess: [] };
  }

  const record = payload as Record<string, unknown>;
  const nestedUser =
    record.user && typeof record.user === "object"
      ? (record.user as User)
      : null;

  if (nestedUser) {
    return {
      user: nestedUser,
      inverterAccess: Array.isArray(record.inverterAccess)
        ? (record.inverterAccess as InverterAccess[])
        : [],
    };
  }

  return {
    user: record as unknown as User,
    inverterAccess: Array.isArray(record.inverterAccess)
      ? (record.inverterAccess as InverterAccess[])
      : [],
  };
}

export function useCurrentUserSync(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const setInverterAccess = useAuthStore((state) => state.setInverterAccess);
  const enabled = (options?.enabled ?? true) && isAuthenticated && !!token;

  const query = useQuery({
    queryKey: ["auth-me"],
    queryFn: () => AuthService.me(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!query.data) return;

    const me = normalizeMePayload(query.data);
    if (!me.user) return;

    const currentUser = useAuthStore.getState().user;
    setInverterAccess(me.inverterAccess ?? []);

    if (currentUser) {
      const defined = Object.fromEntries(
        Object.entries(me.user).filter(([, v]) => v !== undefined && v !== null),
      );
      setUser({ ...currentUser, ...defined } as User);
    } else {
      setUser(me.user);
    }

    const latestAtStart = useAuthStore.getState().user;
    const profileImagePresent = Boolean(
      latestAtStart?.profilePhoto || latestAtStart?.profileUrl,
    );
    if (!profileImagePresent) {
      void (async () => {
        try {
          const personalSettings = await ProfileService.getPersonalSettings();
          if (personalSettings.profileUrl) {
            const latestUser = useAuthStore.getState().user;
            if (
              latestUser &&
              !latestUser.profilePhoto &&
              !latestUser.profileUrl
            ) {
              setUser({
                ...latestUser,
                profilePhoto: personalSettings.profileUrl,
                profileUrl: personalSettings.profileUrl,
              });
            }
          }
        } catch {
          // Ignore fallback failure; this is just a best-effort sync.
        }
      })();
    }
  }, [query.data, setInverterAccess, setUser]);

  return query;
}
