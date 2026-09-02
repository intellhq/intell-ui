"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { AuthService } from "@/services/auth-service";
import {
  resetAuthForOAuthCallback,
} from "@/lib/auth-session";

function cleanOAuthParamsFromUrl() {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  let changed = false;

  const paramsToRemove = ["accessToken", "token", "refreshToken", "error"];
  paramsToRemove.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      changed = true;
    }
  });

  if (url.hash) {
    const hashString = url.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hashString);
    let hashChanged = false;
    paramsToRemove.forEach((param) => {
      if (hashParams.has(param)) {
        hashParams.delete(param);
        hashChanged = true;
      }
    });

    if (hashChanged) {
      const newHash = hashParams.toString();
      url.hash = newHash ? `#${newHash}` : "";
      changed = true;
    }
  }

  if (changed) {
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }
}

function GoogleAuthSyncInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth, setTokensLocal, logout } = useAuthStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hashString = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hashString);

    const error = searchParams.get("error") || hashParams.get("error");

    if (error) {
      cleanOAuthParamsFromUrl();
      const isDuplicateAccount =
        error === "account_exists" || error === "duplicate";
      toast.error(
        isDuplicateAccount
          ? "An account with this email already exists. Please sign in with your email and password."
          : "Sign in failed. Please try again.",
        { duration: 6000 },
      );
      router.replace("/login");
      return;
    }

    const token =
      searchParams.get("accessToken") ||
      searchParams.get("token") ||
      hashParams.get("accessToken") ||
      hashParams.get("token");
    const sessionId =
      searchParams.get("sessionId") || hashParams.get("sessionId") || "";

    if (token && sessionId) {
      cleanOAuthParamsFromUrl();
      void (async () => {
        try {
          resetAuthForOAuthCallback();
          setTokensLocal(token);
          const realUser = await AuthService.me();
          if (realUser?.user?.id) {
            await setAuth({
              user: realUser.user,
              accessToken: token,
              sessionId,
              inverterAccess: realUser.inverterAccess ?? [],
              rememberMe: true,
            });
          } else {
            logout();
          }
        } catch (err) {
          console.error("Failed to fetch user profile", err);
          logout();
        }
      })();
    }
  }, [
    searchParams,
    setAuth,
    setTokensLocal,
    logout,
    router,
  ]);

  return null;
}

export function GoogleAuthSync() {
  return (
    <Suspense fallback={null}>
      <GoogleAuthSyncInner />
    </Suspense>
  );
}
