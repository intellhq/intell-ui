import type { Metadata } from "next";
import { WorksWith } from "@/components/external/brands";
import { Faq } from "@/components/external/faq";
import { Hero } from "@/components/external/hero";
import { PricingSection } from "@/components/external/pricing";
import { RequestDemo } from "@/components/external/request-demo";
import { Services } from "@/components/external/services";
import { TestimonialsSection } from "@/components/external/testimonial";
import { HowItWorksSection } from "@/components/external/how-it-works-section";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "AI Solar Inverter Monitoring Platform",
  description:
    "Monitor solar inverter performance, track battery health, receive intelligent fault alerts, measure savings, and manage energy systems from one INTELL dashboard.",
  path: "/",
  keywords: [
    "AI solar inverter monitoring platform",
    "solar battery health dashboard",
    "energy monitoring for businesses",
  ],
});

const homeJsonLd = [
  createBreadcrumbJsonLd([{ name: "Home", path: "/" }]),
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need new hardware to use INTELL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. INTELL works with supported existing solar and inverter setups so users can monitor energy performance from a dashboard.",
        },
      },
      {
        "@type": "Question",
        name: "What can INTELL monitor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "INTELL helps users monitor inverter performance, battery behaviour, energy usage, alerts, savings, reports, and multi-site energy systems.",
        },
      },
      {
        "@type": "Question",
        name: "Who is INTELL built for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "INTELL is built for households, businesses, installers, and organisations that rely on solar and inverter systems.",
        },
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd data={homeJsonLd} />
      <Hero />
      <section id="features" className="w-full px-6">
        <WorksWith />
        <Services />
        <HowItWorksSection />
      </section>
      <RequestDemo />
      <TestimonialsSection />
      <section id="pricing" className="w-full">
        <PricingSection />
      </section>
      <section id="faq" className="w-full">
        <Faq />
      </section>
    </div>
  );
}
