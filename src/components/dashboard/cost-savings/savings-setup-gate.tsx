"use client";

import { useEffect } from "react";
import { useMounted } from "@/hooks/use-mounted";
import { useAuthStore } from "@/stores/auth-store";
import { SavingsSetupModal } from "./savings-setup-modal";
import { useSavingsSetup } from "./savings-setup-context";

const SESSION_DISMISS_KEY = "intell_savings_setup_dismissed";
const autoOpenCheckedForUser = new Set<string>();

function dismissSetupForSession() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
  } catch (error) {
    console.warn("Failed to persist savings setup dismiss flag:", error);
  }
}

function SavingsSetupAutoOpen({ userId }: { userId: string }) {
  const { openSetup, isSetupComplete, isLoading } = useSavingsSetup();

  useEffect(() => {
    if (isLoading || autoOpenCheckedForUser.has(userId)) return;
    autoOpenCheckedForUser.add(userId);

    const dismissedThisSession =
      sessionStorage.getItem(SESSION_DISMISS_KEY) === "1";

    if (!dismissedThisSession && !isSetupComplete) {
      openSetup();
    }
  }, [userId, isLoading, isSetupComplete, openSetup]);

  return null;
}

/**
 * Mount on the Cost & Savings page only — auto-opens the setup modal on first visit.
 */
export function SavingsSetupGate() {
  const mounted = useMounted();
  const userId = useAuthStore((s) => s.user?.id);

  if (!mounted) return null;

  return (
    <>
      {userId ? <SavingsSetupAutoOpen key={userId} userId={userId} /> : null}
      <SavingsSetupModal onDismissSession={dismissSetupForSession} />
    </>
  );
}
