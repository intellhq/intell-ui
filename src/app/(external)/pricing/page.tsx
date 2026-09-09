import { PricingSection } from "@/components/external/pricing-plan";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "INTELL Pricing",
  description:
    "Compare INTELL plans for inverter monitoring, AI assistant prompts, alerts, savings tracking, and energy reports.",
  path: "/pricing",
  keywords: [
    "solar monitoring pricing",
    "inverter monitoring subscription",
    "AI energy assistant pricing",
    "solar report pricing",
    "energy dashboard pricing",
  ],
});

export default function PricingPage() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <PricingSection />
    </div>
  );
}
