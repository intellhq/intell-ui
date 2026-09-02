"use client";

import { useEffect } from "react";
import { useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import { refreshAuthSession } from "@/lib/auth-session";
import { useAuthStore } from "@/stores/auth-store";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated, user, token, sessionId, logout } =
    useAuthStore();
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const restoreStartedRef = useRef(false);
  const { useOnboardingStatus } = useInverterQueries();
  const {
    data: status,
  } = useOnboardingStatus();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentUrl = `${pathname}${search ? `?${search}` : ""}`;
  const hashParams =
    typeof window === "undefined"
      ? new URLSearchParams()
      : new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const hasIncomingOAuthToken =
    searchParams.has("accessToken") ||
    searchParams.has("token") ||
    hashParams.has("accessToken") ||
    hashParams.has("token");

  const hasResolvedOnboarding =
    Boolean(_hasHydrated) &&
    Boolean(isAuthenticated) &&
    Boolean(user?.id) &&
    Boolean(token);
  const needsSessionRestore =
    Boolean(_hasHydrated) &&
    Boolean(isAuthenticated) &&
    Boolean(sessionId) &&
    !token &&
    !hasIncomingOAuthToken;

  useEffect(() => {
    if (!needsSessionRestore || restoreStartedRef.current) return;

    restoreStartedRef.current = true;
    setIsRestoringSession(true);

    refreshAuthSession()
      .then((result) => {
        if (result.ok) return;

        logout();
        router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      })
      .finally(() => {
        setIsRestoringSession(false);
      });
  }, [currentUrl, logout, needsSessionRestore, router]);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (hasIncomingOAuthToken) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (status?.onboardingComplete === false && user?.onboardingComplete !== true) {
      router.replace("/onboarding");
    }
  }, [
    _hasHydrated,
    hasIncomingOAuthToken,
    isAuthenticated,
    sessionId,
    status?.onboardingComplete,
    user?.onboardingComplete,
    user?.id,
    router,
    currentUrl,
  ]);

  // IMPORTANT: Wait for hydration before rendering anything or redirecting
  if (
    _hasHydrated === false ||
    hasIncomingOAuthToken ||
    needsSessionRestore ||
    isRestoringSession ||
    !hasResolvedOnboarding
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

