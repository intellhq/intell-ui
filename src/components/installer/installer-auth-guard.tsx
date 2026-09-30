"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function InstallerAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isHydrated) return;

    const redirectPath = `${pathname}${
      searchParams.size ? `?${searchParams.toString()}` : ""
    }`;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    if (user?.role !== "installer") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isHydrated, pathname, router, searchParams, user?.role]);

  if (!isHydrated || !isAuthenticated || user?.role !== "installer") {
    return null;
  }

  return <>{children}</>;
}
