import { PricingSection } from "@/components/external/pricing-plan"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing | INTELL",
  description:
    "View our pricing plans and choose the right solution for your energy needs.",
}

export default function PricingPage() {
  return (
    <div className="flex w-full flex-col">
      <PricingSection />
    </div>
  )
}
