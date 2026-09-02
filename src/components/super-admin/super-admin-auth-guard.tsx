"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSuperAdminAuthStore } from "@/stores/super-admin-auth-store";

export function SuperAdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSuperAdminAuthStore(
    (state) => state.isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated) return;
    router.replace(`/super-admin?redirect=${encodeURIComponent(pathname)}`);
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
