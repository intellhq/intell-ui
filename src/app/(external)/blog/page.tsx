import Blog from "@/components/external/blog";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Solar Inverter Monitoring Blog",
  description:
    "Read INTELL guides on solar inverter usage, battery health, energy savings, AI energy management, and smarter power decisions.",
  path: "/blog",
  keywords: [
    "solar inverter blog",
    "solar energy tips",
    "battery monitoring guides",
    "AI energy management articles",
  ],
});

export default function BlogPage() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <Blog />
    </div>
  );
}
