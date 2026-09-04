import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createSeoMetadata({
    title: "Coming Soon",
    description:
      "INTELL is preparing new solar inverter monitoring and energy optimization experiences.",
    path: "/coming-soon",
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Coming Soon", path: "/coming-soon" },
        ])}
      />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-sans text-[32px] leading-[100%] font-bold tracking-[-1%] text-secondary md:text-[48px] mb-2">
          Coming Soon
        </h1>
        <p className="max-w-3xl text-base text-balance text-secondary/70 md:text-lg">
          We&apos;re working hard to bring you something amazing. Stay tuned for
          updates on our blog, careers, news and more.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-7">
          <Button
            asChild
            className="bg-[#f5a623] text-[#111928] hover:bg-[#e0961d] h-12 px-8 text-md font-semibold"
          >
            <Link href="/">Go Back Home</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="border-[#1119284d] rounded-[12px] text-[#111928] hover:bg-[#111928] hover:text-white h-12 px-8 text-md font-semibold"
          >
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
