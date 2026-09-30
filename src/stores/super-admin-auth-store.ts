"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

interface SuperAdminAuthState {
  isAuthenticated: boolean;
  token: string | null;
  sessionId: string | null;
  user: User | null;
  login: (payload?: { token?: string; sessionId?: string; user?: User }) => void;
  logout: () => void;
}

export const useSuperAdminAuthStore = create<SuperAdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      sessionId: null,
      user: null,
      login: (payload) =>
        set({
          isAuthenticated: true,
          token: payload?.token ?? null,
          sessionId: payload?.sessionId ?? null,
          user: payload?.user ?? null,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          token: null,
          sessionId: null,
          user: null,
        }),
    }),
    {
      name: "super-admin-auth-storage",
    },
  ),
);
