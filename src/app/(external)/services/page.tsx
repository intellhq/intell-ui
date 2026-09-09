import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ServicesPage } from "@/components/external/services-page";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "INTELL Services",
  description:
    "Explore INTELL services for AI solar inverter monitoring, native alerts, cost and savings tracking, and plug-and-play inverter monitoring support.",
  path: "/services",
  keywords: [
    "solar inverter monitoring services",
    "AI energy agent",
    "solar alerts",
    "solar cost savings tracker",
    "plug and play inverter monitoring",
    "supported inverter brands Nigeria",
  ],
});

const servicesJsonLd = [
  createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "INTELL solar inverter monitoring services",
    provider: {
      "@type": "Organization",
      name: "INTELL",
      url: "https://www.intell.ng",
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    serviceType: [
      "AI energy monitoring",
      "Solar inverter alerts",
      "Cost and savings tracking",
      "Plug-and-play inverter monitoring",
    ],
    description:
      "AI-powered services for monitoring solar inverter performance, receiving proactive alerts, tracking savings, and connecting compatible inverter systems.",
  },
];

export default function ServicesRoutePage() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd data={servicesJsonLd} />
      <ServicesPage />
    </div>
  );
}
