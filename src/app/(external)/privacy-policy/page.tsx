import PrivacyPolicy from "@/components/external/privacy-policy";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Privacy Policy",
  description:
    "Our privacy policy outlines how we collect, use, and protect your personal information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />
      <PrivacyPolicy />
    </div>
  );
}
