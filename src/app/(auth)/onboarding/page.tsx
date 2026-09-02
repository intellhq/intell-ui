"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { InverterTypeStep } from "@/components/onboarding/inverter-type-step";
import { InverterConnectionStep } from "@/components/onboarding/inverter-connection-step";
import { OnboardingSuccessDialog } from "@/components/onboarding/onboarding-success-dialog";
import { INVERTER_CONFIG } from "@/components/onboarding/inverter-config";
import { useAuthStore } from "@/stores/auth-store";
import { AuthService } from "@/services/auth-service";
import { trackEvent, identifyUser } from "@/lib/analytics";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useInverterQueries } from "@/hooks/use-inverter-queries";

type Step = "select" | "connect";

export default function OnboardingPage() {
  const {
    step,
    setStep,
    inverterType: inverter,
    resetOnboarding,
  } = useOnboardingStore();
  const [successOpen, setSuccessOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated } = useAuthStore();
  const isCompleted = useRef(false);
  const stepRef = useRef<Step>(step);

  const { useOnboardingStatus } = useInverterQueries();
  const { data: status, isError: isStatusError } = useOnboardingStatus();

  const isFullyOnboarded =
    status?.onboardingComplete === true &&
    status?.steps?.accountCreated === true &&
    status?.steps?.emailVerified === true &&
    status?.steps?.inverterConnected === true;

  const userId = user?.id;

  const isLoading =
    !_hasHydrated ||
    !userId ||
    (!status && !isStatusError) ||
    isFullyOnboarded;

  useEffect(() => {
    if (isFullyOnboarded && user?.id) {
      isCompleted.current = true;
      resetOnboarding();
      router.replace("/dashboard");
    }
  }, [isFullyOnboarded, resetOnboarding, user?.id, router]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (!_hasHydrated) {
      return;
    }

    if (user?.id) {
      identifyUser(user.id);
      return;
    }

    const searchParamsObj = new URLSearchParams(window.location.search);
    const hashString = window.location.hash.replace(/^#/, "");
    const hashParamsObj = new URLSearchParams(hashString);
    const incomingToken =
      searchParamsObj.get("accessToken") ||
      searchParamsObj.get("token") ||
      hashParamsObj.get("accessToken") ||
      hashParamsObj.get("token");

    const shouldRestoreSession =
      !incomingToken && (!isAuthenticated || !user?.id);

    if (!shouldRestoreSession) {
      return;
    }

    const { setUser, setInverterAccess, logout } = useAuthStore.getState();

    AuthService.me()
      .then((realUser) => {
        if (realUser?.user?.id) {
          setUser(realUser.user);
          setInverterAccess(realUser.inverterAccess ?? []);
          useAuthStore.setState({ isAuthenticated: true });
          return;
        }

        logout();
        router.replace("/login");
      })
      .catch(() => {
        logout();
        router.replace("/login");
      });
  }, [_hasHydrated, user, isAuthenticated, router, resetOnboarding]);

  // Track page unload / tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isCompleted.current) {
        trackEvent("Onboarding Abandoned", {
          screen_name:
            step === "select"
              ? "Inverter Type Selection"
              : "Inverter Connection Details",
          exit_type: "tab_close",
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step]);

  useEffect(() => {
    return () => {
      if (!isCompleted.current) {
        trackEvent("Onboarding Abandoned", {
          screen_name:
            stepRef.current === "select"
              ? "Inverter Type Selection"
              : "Inverter Connection Details",
          exit_type: "client_navigation",
        });
      }
    };
  }, []);
  if (isLoading) {
    return (
      <AuthWrapper>
        <div className="mt-28 flex items-center justify-center lg:mt-44">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className="mt-28 lg:mt-44">
        {step === "select" ? (
          <>
            <AuthHeader
              title="What Inverter Type do you Use?"
              subtitle="Select your Inverter type so we can tailor your experience"
            />
            <InverterTypeStep
              onNext={() => inverter && setStep("connect")}
              onCancel={() => router.push("/")}
            />
          </>
        ) : (
          inverter && (
            <>
              <AuthHeader
                title={`${INVERTER_CONFIG[inverter.toLowerCase()]?.name || inverter} Inverter Connection`}
                subtitle="Enter specific details of your inverter type"
              />
              <InverterConnectionStep
                key={inverter}
                onBack={() => setStep("select")}
                onConnected={() => {
                  isCompleted.current = true;
                  resetOnboarding();
                  setSuccessOpen(true);
                }}
              />
            </>
          )
        )}
      </div>
      <OnboardingSuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
      />
    </AuthWrapper>
  );
}

