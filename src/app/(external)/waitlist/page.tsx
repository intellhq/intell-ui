import type { Metadata } from "next";
import { WaitlistPageContent } from "@/components/external/waitlist";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Waitlist",
  description:
    "Join the INTELL waitlist and tell us about your solar inverter setup for compatibility checks, smart monitoring, alerts, savings tracking, and AI energy guidance.",
  path: "/waitlist",
  keywords: [
    "solar inverter monitoring waitlist",
    "connect solar inverter monitoring",
    "get solar monitoring dashboard",
    "INTELL waitlist",
  ],
  image: "/images/request_demo_3.jpg",
});

export default function WaitlistPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Waitlist", path: "/waitlist" },
        ])}
      />
      <WaitlistPageContent />
    </>
  );
}
