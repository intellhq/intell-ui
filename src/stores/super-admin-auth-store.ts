"use client";

import { create } from "zustand";

interface SuperAdminAuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useSuperAdminAuthStore = create<SuperAdminAuthState>()((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));
