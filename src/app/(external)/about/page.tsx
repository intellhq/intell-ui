import AboutPage from "@/components/external/about-us";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "About INTELL",
  description:
    "Learn how INTELL helps households, businesses, installers, and organisations monitor solar inverter performance, prevent faults, and reduce energy uncertainty.",
  path: "/about",
  keywords: ["about INTELL", "solar energy monitoring company"],
});

export default function AboutUsPage() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <AboutPage />
    </div>
  );
}
