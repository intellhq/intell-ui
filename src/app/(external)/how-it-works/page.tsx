import HowItWorks from "@/components/external/how-it-works";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "How INTELL Works",
  description:
    "See how INTELL connects inverter data, monitors battery and energy performance, sends proactive alerts, and turns solar usage into clear savings insights.",
  path: "/how-it-works",
  keywords: [
    "how solar inverter monitoring works",
    "connect solar inverter dashboard",
    "solar performance alerts",
  ],
});

export default function HowItWorksPage() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "How It Works", path: "/how-it-works" },
        ])}
      />
      <HowItWorks />
    </div>
  );
}
