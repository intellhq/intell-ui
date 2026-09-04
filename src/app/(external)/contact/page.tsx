import Contact from "@/components/external/contact";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Contact INTELL",
  description:
    "Contact INTELL to discuss solar inverter monitoring, smart energy alerts, savings tracking, and multi-site energy management.",
  path: "/contact",
  keywords: ["contact solar monitoring platform", "INTELL demo"],
});

export default function ContactPage() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <Contact />
    </div>
  );
}
