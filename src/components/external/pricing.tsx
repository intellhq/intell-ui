"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type BillingPeriod = "monthly" | "yearly";

interface PricingTier {
  id: string;
  label: string;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyPeriod: string;
  yearlyPeriod: string;
  description: string;
  features: string[];
  cta: string;
  ctaVariant: "outline" | "primary" | "secondary";
  badge?: string;
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    label: "FREE",
    monthlyPrice: "₦0",
    yearlyPrice: "₦0",
    monthlyPeriod: "/ Mo",
    yearlyPeriod: "/ Yr",
    description:
      "Free for everyone",
    features: [
      "Real-time dashboard",
      "Core alerts and savings tracker",
      "3 AI prompts per day",
      "3 reports per month",
      "Report links expire after 14 days",
    ],
    cta: "Get started free",
    ctaVariant: "outline",
  },
  {
    id: "plus",
    label: "PLUS",
    monthlyPrice: "₦2,500",
    yearlyPrice: "₦25,000",
    monthlyPeriod: "/ Mo",
    yearlyPeriod: "/ Yr",
    description:
      "For everyday performance",
    features: [
      "Everything in Free",
      "150 AI prompts per month",
      "20 reports per month",
      "90-day report links",
      "Priority support",
    ],
    cta: "Upgrade to Plus",
    ctaVariant: "primary",
    badge: "Most Popular",
    highlighted: true,
  },
  {
    id: "pro",
    label: "PRO",
    monthlyPrice: "₦7,500",
    yearlyPrice: "₦75,000",
    monthlyPeriod: "/ Mo",
    yearlyPeriod: "/ Yr",
    description:
      "Get the most out of INTELL",
    features: [
      "Everything in Plus",
      "Unlimited AI prompts with fair-use limits",
      "Unlimited reports",
      "Long-lived report links",
      "Advanced savings and system insights",
    ],
    cta: "Go Pro",
    ctaVariant: "outline",
  },
];

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  return (
    <section className="w-full bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-title1 mx-auto w-full max-w-180 leading-tight font-semibold lg:text-5xl">
            Simple pricing for inverter owners.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Monitoring, alerts, and savings tracking stay useful on every plan.
            Paid plans expand AI assistant usage and reporting capacity.
          </p>
        </motion.div>

        <div className="mb-12 flex justify-center">
          <button
            type="button"
            onClick={() => setBillingPeriod("monthly")}
            className={`h-10.5 w-30 cursor-pointer rounded-l-lg px-6 py-2 text-base font-medium transition-colors ${
              billingPeriod === "monthly"
                ? "bg-secondary text-white"
                : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod("yearly")}
            className={`h-10.5 w-30 cursor-pointer rounded-r-lg px-6 py-2 text-base font-medium transition-colors ${
              billingPeriod === "yearly"
                ? "bg-secondary text-white"
                : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            Yearly
          </button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid w-full max-w-240 grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className={`flex flex-col overflow-hidden rounded-3xl p-8 transition-all md:min-h-[520px] ${
                tier.highlighted
                  ? "bg-[#1a2332] text-white shadow-2xl ring-2 ring-transparent hover:ring-[#E08A1E]"
                  : "border border-[#E7E7E7] bg-[#FDFDFD] hover:shadow-md"
              }`}
            >
              {tier.badge && (
                <div className="mb-7 flex justify-center">
                  <span className="text-secondary inline-block rounded-full bg-[#F1F1F1F1] px-4 py-1.5 text-xs">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-7 flex items-baseline gap-1">
                <span className="t text-3xl font-bold tracking-tight lg:text-5xl">
                  {billingPeriod === "monthly"
                    ? tier.monthlyPrice
                    : tier.yearlyPrice}
                </span>
                {tier.id !== "free" && (
                  <span
                    className={`text-base font-medium md:text-2xl ${
                      tier.highlighted ? "text-[#F6F6F6]" : "text-secondary"
                    }`}
                  >
                    {billingPeriod === "monthly"
                      ? tier.monthlyPeriod
                      : tier.yearlyPeriod}
                  </span>
                )}
              </div>

              <h3
                className={`mb-4 text-lg font-semibold tracking-wider ${
                  tier.highlighted ? "text-white" : "text-[#1A1F2C]"
                }`}
              >
                {tier.label}
              </h3>

              <p
                className={`mb-8 text-sm leading-relaxed ${
                  tier.highlighted ? "text-white" : "text-gray-700"
                }`}
              >
                {tier.description}
              </p>

              <div className="mb-4 space-y-2">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span
                      className={`font-plus-jakarta-sans mt-1 shrink-0 text-sm ${
                        tier.highlighted ? "text-white" : "text-[#5D5C5D]"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm leading-relaxed ${
                        tier.highlighted ? "text-white" : "text-[#5D5C5D]"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <Button
                  asChild
                  variant={
                    tier.ctaVariant === "primary"
                      ? "default"
                      : tier.ctaVariant === "outline"
                        ? "outline"
                        : "secondary"
                  }
                  className={`w-full cursor-pointer p-3 text-base font-medium transition-all ${
                    tier.ctaVariant === "primary"
                      ? "bg-primary text-[#F6F6F6] hover:bg-[#D07A0E]"
                      : tier.ctaVariant === "outline" && tier.highlighted
                        ? "border border-white text-white hover:border-gray-200 hover:bg-white hover:text-gray-900"
                        : "border border-[#080C13] text-[#080C13] hover:bg-gray-900 hover:text-white"
                  }`}
                >
                  <Link href="/signup">{tier.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
