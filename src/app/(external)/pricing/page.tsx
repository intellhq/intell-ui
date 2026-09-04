import { PricingSection } from "@/components/external/pricing-plan";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "INTELL Pricing",
  description:
    "View our pricing plans and choose the right solution for your energy needs.",
  path: "/pricing",
  keywords: [
    "solar monitoring pricing",
    "inverter monitoring subscription",
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
