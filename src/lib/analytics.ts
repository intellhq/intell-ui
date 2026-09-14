import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const COOKIE_CONSENT_NAME = "intell_cookie_preferences";
export const COOKIE_CONSENT_VERSION = "2026-03-25";

export type CookieConsentPreferences = {
  necessary: true;
  functional: true;
  analytics: boolean;
  marketing: boolean;
  version: string;
  updatedAt: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
  }
}

let mixpanelInitialized = false;

const PII_KEY_PATTERN =
  /^(email|password|passcode|phone|phoneNumber|address|firstName|lastName|fullName|first_name|last_name|full_name|name|message|token|secret|credential|credentials|authorization|apiKey|api_key|accessToken|refreshToken|inverterPassword|solarmanPassword|loggerSerial|serialNumber)$/i;

const DEFAULT_COOKIE_PREFERENCES: CookieConsentPreferences = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: false,
  version: COOKIE_CONSENT_VERSION,
  updatedAt: "",
};

const getDefaultPreferences = (): CookieConsentPreferences => ({
  ...DEFAULT_COOKIE_PREFERENCES,
  updatedAt: new Date().toISOString(),
});

const isBrowser = () => typeof window !== "undefined";

const getCookie = (name: string) => {
  if (!isBrowser()) return null;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : null;
};

const setCookie = (name: string, value: string, days = 180) => {
  if (!isBrowser()) return;

  const maxAge = days * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

export const hasStoredCookieConsent = () =>
  Boolean(getCookie(COOKIE_CONSENT_NAME));

export const getCookieConsentPreferences = (): CookieConsentPreferences => {
  const stored = getCookie(COOKIE_CONSENT_NAME);

  if (!stored) return getDefaultPreferences();

  try {
    const parsed = JSON.parse(stored) as Partial<CookieConsentPreferences>;

    return {
      necessary: true,
      functional: true,
      analytics: parsed.analytics ?? true,
      marketing: parsed.marketing ?? false,
      version: parsed.version ?? COOKIE_CONSENT_VERSION,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return getDefaultPreferences();
  }
};

export const saveCookieConsentPreferences = (
  preferences: Partial<CookieConsentPreferences>,
) => {
  const nextPreferences: CookieConsentPreferences = {
    necessary: true,
    functional: true,
    analytics: preferences.analytics ?? true,
    marketing: preferences.marketing ?? false,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };

  setCookie(COOKIE_CONSENT_NAME, JSON.stringify(nextPreferences));
  applyConsentToAnalytics(nextPreferences);

  return nextPreferences;
};

export const acceptAllCookiePreferences = () =>
  saveCookieConsentPreferences({ analytics: true, marketing: true });

export const rejectNonEssentialCookiePreferences = () =>
  saveCookieConsentPreferences({ analytics: false, marketing: false });

const sanitizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sanitizeValue);

  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};

    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (PII_KEY_PATTERN.test(key)) continue;
      out[key] = sanitizeValue(item);
    }

    return out;
  }

  if (typeof value === "string") {
    if (value.includes("@")) return undefined;
    if (value.length > 160) return `${value.slice(0, 157)}...`;
  }

  return value;
};

const sanitizeProperties = (properties?: Record<string, unknown>) => {
  const sanitized = sanitizeValue(properties ?? {}) as Record<string, unknown>;

  return Object.fromEntries(
    Object.entries(sanitized).filter(([, value]) => value !== undefined),
  );
};

const isSuperAdminPath = (path?: string) => {
  const pathname = path ?? (isBrowser() ? window.location.pathname : "");
  return pathname.startsWith("/super-admin");
};

const ensureMixpanel = () => {
  if (!isBrowser() || !MIXPANEL_TOKEN || mixpanelInitialized) return;

  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === "development",
    track_pageview: false,
    persistence: "cookie",
    api_transport: "sendBeacon",
  });

  mixpanelInitialized = true;
};

export const pushDataLayerEvent = (event: Record<string, unknown>) => {
  if (!isBrowser()) return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
};

export const applyConsentToAnalytics = (
  preferences = getCookieConsentPreferences(),
) => {
  if (!isBrowser()) return;

  const consentState = {
    analytics_storage: preferences.analytics ? "granted" : "denied",
    ad_storage: preferences.marketing ? "granted" : "denied",
    ad_user_data: preferences.marketing ? "granted" : "denied",
    ad_personalization: preferences.marketing ? "granted" : "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  };

  window.dataLayer = window.dataLayer ?? [];
  window.gtag?.("consent", "update", consentState);
  pushDataLayerEvent({
    event: "cookie_consent_updated",
    analytics_consent: preferences.analytics,
    marketing_consent: preferences.marketing,
  });

  if (!MIXPANEL_TOKEN) return;

  ensureMixpanel();

  if (!mixpanelInitialized) return;

  if (preferences.analytics && !isSuperAdminPath()) {
    mixpanel.opt_in_tracking();
  } else {
    mixpanel.opt_out_tracking();
  }
};

export const initializeAnalytics = () => {
  if (!isBrowser()) return;

  applyConsentToAnalytics(getCookieConsentPreferences());
};

export const canTrackAnalytics = () => {
  if (!isBrowser() || isSuperAdminPath()) return false;
  return getCookieConsentPreferences().analytics;
};

export const identifyUser = (userId: string) => {
  if (!canTrackAnalytics() || !MIXPANEL_TOKEN) return;

  ensureMixpanel();
  if (mixpanelInitialized) mixpanel.identify(userId);
};

export const trackEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
) => {
  if (!canTrackAnalytics()) return;

  const sanitizedProperties = sanitizeProperties(properties);
  const baseProperties = {
    ...sanitizedProperties,
    path: window.location.pathname,
    page_title: document.title,
    timestamp: new Date().toISOString(),
  };

  pushDataLayerEvent({
    event: eventName.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
    event_name: eventName,
    ...baseProperties,
  });

  if (!MIXPANEL_TOKEN) return;

  ensureMixpanel();
  if (mixpanelInitialized) mixpanel.track(eventName, baseProperties);
};

export const trackPageView = (pathname: string) => {
  trackEvent("Page Viewed", {
    page_path: pathname,
    page_url: window.location.origin + pathname,
  });
};
