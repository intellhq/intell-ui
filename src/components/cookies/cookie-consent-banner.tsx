"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  acceptAllCookiePreferences,
  CookieConsentPreferences,
  getCookieConsentPreferences,
  hasStoredCookieConsent,
  rejectNonEssentialCookiePreferences,
  saveCookieConsentPreferences,
  trackEvent,
} from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const APP_ROUTES_WITH_IMPLICIT_POLICY = [
  "/dashboard",
  "/installer",
  "/super-admin",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/onboarding",
];

const shouldHideBannerForPath = (pathname: string) =>
  APP_ROUTES_WITH_IMPLICIT_POLICY.some((route) => pathname.startsWith(route));

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(() =>
    getCookieConsentPreferences(),
  );
  const shouldShowBanner =
    typeof window !== "undefined" &&
    isVisible &&
    !hasStoredCookieConsent() &&
    !shouldHideBannerForPath(pathname);

  useEffect(() => {
    const openSettings = () => {
      setPreferences(getCookieConsentPreferences());
      setIsPreferencesOpen(true);
      setIsVisible(false);
      trackEvent("Cookie Settings Opened", { source: "footer" });
    };

    window.addEventListener("intell:open-cookie-settings", openSettings);
    return () =>
      window.removeEventListener("intell:open-cookie-settings", openSettings);
  }, []);

  const acceptAll = () => {
    setPreferences(acceptAllCookiePreferences());
    setIsVisible(false);
    trackEvent("Cookie Consent Accepted", { preference: "all" });
  };

  const rejectNonEssential = () => {
    setPreferences(rejectNonEssentialCookiePreferences());
    setIsVisible(false);
  };

  const savePreferences = () => {
    setPreferences(saveCookieConsentPreferences(preferences));
    setIsPreferencesOpen(false);
    setIsVisible(false);
    trackEvent("Cookie Preferences Saved", {
      analytics: preferences.analytics,
      marketing: preferences.marketing,
    });
  };

  return (
    <>
      {shouldShowBanner ? (
        <div className="fixed right-0 bottom-0 left-0 z-50 rounded-t-3xl border border-slate-200 bg-white p-4 shadow-2xl sm:right-6 sm:bottom-6 sm:left-auto sm:w-[520px] sm:rounded-2xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-950">
                INTELL uses cookies
              </p>
              <p className="text-sm leading-6 text-slate-600">
                We use essential cookies to improve your experience. You can
                accept all, reject non-essential cookies, or choose which
                categories you allow. See our{" "}
                <Link
                  href="/cookie-policy"
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  Cookie Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={rejectNonEssential}
                className="border-slate-300 text-slate-700"
              >
                Reject non-essential
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPreferencesOpen(true)}
                className="border-slate-300 text-slate-700"
              >
                Customize
              </Button>
              <Button
                type="button"
                onClick={acceptAll}
                className="bg-primary text-secondary hover:bg-primary/90"
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="max-w-lg max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:flex max-sm:h-[55dvh] max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:grid-rows-none max-sm:flex-col max-sm:gap-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:p-0">
          <DialogHeader className="max-sm:shrink-0 max-sm:border-b max-sm:border-slate-200 max-sm:px-5 max-sm:pt-5 max-sm:pb-4">
            <DialogTitle>Cookie preferences</DialogTitle>
            <DialogDescription>
              Functional cookies are strictly necessary and always on. Choose
              any other categories you want to allow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-sm:min-h-0 max-sm:flex-1 max-sm:overflow-y-auto max-sm:px-5 max-sm:py-4">
            <PreferenceRow
              title="Functional cookies"
              description="Strictly necessary for app preferences and expected product behavior."
              checked
              disabled
            />
            <PreferenceRow
              title="Analytics cookies"
              description="Helps us understand page views, product usage, and feature engagement."
              checked={preferences.analytics}
              onCheckedChange={(analytics) =>
                setPreferences((current) => ({ ...current, analytics }))
              }
            />
            <PreferenceRow
              title="Marketing cookies"
              description="Allows future campaign measurement and advertising-related tracking."
              checked={preferences.marketing}
              onCheckedChange={(marketing) =>
                setPreferences((current) => ({ ...current, marketing }))
              }
            />
          </div>

          <div className="flex flex-col gap-2 max-sm:shrink-0 max-sm:border-t max-sm:border-slate-200 max-sm:bg-white max-sm:p-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={rejectNonEssential}
              className="border-slate-300 text-slate-700"
            >
              Reject non-essential
            </Button>
            <Button
              type="button"
              onClick={savePreferences}
              className="bg-primary text-secondary hover:bg-primary/90"
            >
              Save preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div className="space-y-1">
        <p className="font-semibold text-slate-950">{title}</p>
        <p className="text-sm leading-5 text-slate-600">{description}</p>
      </div>
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        aria-label={title}
      />
    </div>
  );
}
