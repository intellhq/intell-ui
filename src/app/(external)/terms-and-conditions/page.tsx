import TermsAndCondition from "@/components/external/terms-and-condition";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Terms and Conditions",
  description: "Terms and conditions for using the INTELL platform.",
  path: "/terms-and-conditions",
});

export default function TermsAndConditionsPage() {
  return (
    <div className="flex w-full flex-col">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          {
            name: "Terms and Conditions",
            path: "/terms-and-conditions",
          },
        ])}
      />
      <TermsAndCondition />
    </div>
  );
}
