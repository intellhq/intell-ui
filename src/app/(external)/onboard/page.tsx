import type { Metadata } from "next";
import { OnboardPageContent } from "@/components/external/onboard";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Onboard",
  description:
    "Tell INTELL about your solar inverter setup and get contacted for compatibility checks, smart monitoring, alerts, savings tracking, and AI energy guidance.",
  path: "/onboard",
  keywords: [
    "solar inverter onboarding Nigeria",
    "connect solar inverter monitoring",
    "get solar monitoring dashboard",
    "INTELL onboarding",
  ],
  image: "/images/request_demo_3.jpg",
});

export default function OnboardPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Onboard", path: "/onboard" },
        ])}
      />
      <OnboardPageContent />
    </>
  );
}
