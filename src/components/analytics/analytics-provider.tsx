"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initializeAnalytics, trackEvent, trackPageView } from "@/lib/analytics";

const getElementLabel = (element: Element) =>
  (element.getAttribute("data-analytics-label") ||
    element.getAttribute("aria-label") ||
    element.textContent ||
    "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

const getLinkEventName = (href: string) => {
  if (href.startsWith("mailto:")) return "Email Link Clicked";
  if (href.startsWith("tel:")) return "Phone Link Clicked";
  if (/linkedin|instagram|twitter|x\.com|facebook|youtube/i.test(href)) {
    return "Social Link Clicked";
  }
  return "Link Clicked";
};

export function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const startedForms = new WeakSet<HTMLFormElement>();

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest<HTMLElement>(
        "a, button, [role='button'], [data-analytics-event]",
      );

      if (!element || element.closest("[data-analytics-ignore='true']")) return;

      const link = element.closest<HTMLAnchorElement>("a[href]");
      const customEvent = element.getAttribute("data-analytics-event");
      const href = link?.getAttribute("href") ?? undefined;
      const eventName =
        customEvent ?? (href ? getLinkEventName(href) : "Button Clicked");

      trackEvent(eventName, {
        label: getElementLabel(element),
        href,
        location: element.getAttribute("data-analytics-location"),
        element_type: element.tagName.toLowerCase(),
      });
    };

    const handleFormStart = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const form = target.closest("form");
      if (!form || startedForms.has(form)) return;

      startedForms.add(form);
      trackEvent("Form Started", {
        form_name:
          form.getAttribute("data-analytics-form") ||
          form.getAttribute("aria-label") ||
          form.id ||
          "Unnamed form",
      });
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleFormStart, true);
    document.addEventListener("change", handleFormStart, true);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("input", handleFormStart, true);
      document.removeEventListener("change", handleFormStart, true);
    };
  }, []);

  return null;
}
