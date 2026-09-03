"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLoginForm } from "@/components/auth/auth-login-form";
import { useAuthStore } from "@/stores/auth-store";

const getSafeRedirect = (redirect: string | null, fallback: string): string => {
  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//") &&
    !redirect.includes("://")
  ) {
    return redirect;
  }

  return fallback;
};

export default function LoginPage() {
  const { setTempEmail, isAuthenticated, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Run once after hydrate: redirect only if user was already logged in before landing here.
  // Fresh logins redirect once from useLogin — avoids two navigations (slow in dev).
  useEffect(() => {
    if (!_hasHydrated) return;
    if (!useAuthStore.getState().isAuthenticated) return;

    const redirect = searchParams.get("redirect");
    router.replace(getSafeRedirect(redirect, "/dashboard"));
  }, [_hasHydrated, router, searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      setTempEmail(null);
      localStorage.removeItem("temp_email");
    }
  }, [isAuthenticated, setTempEmail]);

  return (
    <AuthWrapper>
      <div className="mt-29 lg:mt-44">
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign In to your INTELL account. Take Control of your Energy."
        />
        <AuthLoginForm />
      </div>
    </AuthWrapper>
  );
}
