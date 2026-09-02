"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthInput } from "@/components/auth/auth-input";
import { useSuperAdminAuthStore } from "@/stores/super-admin-auth-store";

function getSafeSuperAdminRedirect(redirect: string | null) {
  if (
    redirect &&
    redirect.startsWith("/super-admin/") &&
    !redirect.startsWith("//") &&
    !redirect.includes("://")
  ) {
    return redirect;
  }

  return "/super-admin/dashboard";
}

export function SuperAdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useSuperAdminAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsPending(true);

    const response = await fetch("/api/super-admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Invalid super admin credentials.");
      setIsPending(false);
      return;
    }

    login();
    router.replace(getSafeSuperAdminRedirect(searchParams.get("redirect")));
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" noValidate>
      <div className="flex flex-col gap-2">
        <div className="space-y-3 md:space-y-4">
          <AuthInput
            label="Email Address"
            id="super-admin-email"
            placeholder="Enter your email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            hideErrorMessage
          />
          <AuthInput
            label="Password"
            id="super-admin-password"
            placeholder="************"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            hideErrorMessage
          />
        </div>
      </div>

      {error ? (
        <p className="text-destructive text-sm font-medium">{error}</p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 md:mt-12">
        <Button
          type="submit"
          disabled={isPending}
          className="mx-auto flex h-[54px] w-full max-w-[527px] items-center justify-center rounded-lg bg-secondary px-16 py-2 text-base font-semibold text-white shadow-sm transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:bg-[#E8E8E8] disabled:text-dark-text disabled:opacity-100 disabled:shadow-none md:text-lg"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
