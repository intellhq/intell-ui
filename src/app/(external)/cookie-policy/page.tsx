import type { Metadata } from "next";
import { CookiePolicy } from "@/components/external/cookie-policy";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Cookie Policy",
  description:
    "Learn how INTELL uses cookies, Mixpanel, Google Tag Manager, and GA4 to support platform functionality and product analytics.",
  path: "/cookie-policy",
  keywords: [
    "INTELL cookie policy",
    "solar monitoring analytics cookies",
    "energy monitoring cookie policy",
  ],
  image: "/images/request_demo_3.jpg",
});

export default function CookiePolicyPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Cookie Policy", path: "/cookie-policy" },
        ])}
      />
      <CookiePolicy />
    </>
  );
}
