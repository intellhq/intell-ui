"use client";

import { useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
  type Variants,
} from "motion/react";
import Image from "next/image";
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
  customMonthlyPrice?: string;
  customYearlyPrice?: string;
  customMonthlyPeriod?: string;
  customYearlyPeriod?: string;
}

const CheckIcon = () => (
  <div className="flex justify-center">
    <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-amber-50">
      <svg
        width="9"
        height="8"
        viewBox="0 0 9 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 4L3.5 6L7.5 2"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const comparisonData = [
  {
    feature: "Systems connected",
    free: "1 System",
    pro: "Up to 3 Systems",
    enterprise: "Unlimited",
  },
  {
    feature: "Live monitoring (Battery, Solar, Load)",
    free: <CheckIcon />,
    pro: <CheckIcon />,
    enterprise: <CheckIcon />,
  },
  {
    feature: "Energy history",
    free: "—",
    pro: <CheckIcon />,
    enterprise: <CheckIcon />,
  },
  {
    feature: "Daily Savings tracking in Naira",
    free: "—",
    pro: <CheckIcon />,
    enterprise: <CheckIcon />,
  },
  {
    feature: "Whatsapp alert",
    free: "Basic",
    pro: "Smart",
    enterprise: "Advanced",
  },
  {
    feature: "AI assistant (English + Pidgin)",
    free: "—",
    pro: <CheckIcon />,
    enterprise: <CheckIcon />,
  },
  {
    feature: "Monthly performance reports",
    free: "—",
    pro: "PDF Reports",
    enterprise: "Custom Reports",
  },
  {
    feature: "Multi-site monitoring",
    free: "—",
    pro: "—",
    enterprise: <CheckIcon />,
  },
  {
    feature: "Installer dashboard for clients",
    free: "—",
    pro: "—",
    enterprise: <CheckIcon />,
  },
  {
    feature: "White-label option",
    free: "—",
    pro: "—",
    enterprise: <CheckIcon />,
  },
  {
    feature: "Api-access",
    free: "—",
    pro: "—",
    enterprise: <CheckIcon />,
  },
  {
    feature: "Team management",
    free: "—",
    pro: "—",
    enterprise: <CheckIcon />,
  },
];

const faqData = [
  {
    question: "Do I need to install new hardware?",
    answer:
      "No, you don't need to install any new hardware. INTELL works with your existing inverter and solar setup. You simply connect your system details or integrate with supported inverter platforms to start monitoring your energy in real time.",
  },
  {
    question: "Which inverter brands are supported?",
    answer:
      "INTELL supports a wide range of popular inverter brands including Victron, Fronius, Growatt, and more. We are constantly adding support for new platforms.",
  },
  {
    question: "Does the AI agent really speak Pidgin?",
    answer:
      "Yes, our AI agent is trained to understand and respond in Pidgin, making it easier for everyone to interact with their energy data naturally.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. We use industry-standard encryption and security protocols to ensure your energy data and personal information are protected at all times.",
  },
  {
    question: "Can solar installers white‑label INTELL?",
    answer:
      "Yes, we offer white-label solutions for solar installers and distributors. Contact our sales team for more information on our partner programs.",
  },
];

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    label: "FREE",
    monthlyPrice: "₦0",
    yearlyPrice: "₦0",
    monthlyPeriod: "/ Mo",
    yearlyPeriod: "/ Yr",
    description: "For one inverter. Get the dashboard and core alerts.",
    features: [
      "1 Inverter brand",
      "Real time dashboard",
      "Saving tracker",
      "Basic Whatsapp Alerts",
    ],
    cta: "Get started free",
    ctaVariant: "outline",
  },
  {
    id: "pro",
    label: "PRO",
    monthlyPrice: "₦500",
    yearlyPrice: "₦5,900",
    monthlyPeriod: "/ Mo",
    yearlyPeriod: "/ Yr",
    description:
      "For Full AI agent + alerts + reports, up to 3 systems per month.",
    features: [
      "Multi - Site/ System Management",
      "White label dashboard",
      "Priority Support and SLAs",
      "Rea/Nerc Compliance Report",
      "Dedicated Account Manager",
      "API Access",
      "Field Technician Mobile Workflow",
    ],
    cta: "Start 30-Day Free Trial",
    ctaVariant: "primary",
    badge: "✦ Most Popular",
    highlighted: true,
  },
  {
    id: "enterprise",
    label: "ENTERPRISE",
    monthlyPrice: "Custom",
    yearlyPrice: "Custom",

    customMonthlyPrice: "₦1,500",
    customYearlyPrice: "₦17,000",

    monthlyPeriod: "/ Mo",
    yearlyPeriod: "/ Yr",

    description: "for installers, EPC Contractors and mini-grids",
    features: [
      "Multi - Site/ System Management",
      "White label dashboard",
      "Priority Support and SLAs",
      "Rea/Nerc Compliance Report",
      "Dedicated Account Manager",
      "API Access",
      "Field Technician Mobile Workflow",
    ],
    cta: "Get started free",
    ctaVariant: "outline",
  },
];

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="bg-background selection:bg-amber-10 min-h-screen font-sans text-slate-100 selection:text-amber-800">
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1.5 origin-left"
        style={{ scaleX }}
      />
      <header className="bg-secondary relative h-75 w-full overflow-hidden md:h-100">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/panels.jpg')" }}
        />
        <div className="from-secondary/40 via-secondary/60 to-secondary absolute inset-0 z-10 bg-linear-to-b" />

        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-5xl"
          >
            Simple Plans no Surprises
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-3xl text-base text-balance text-slate-50 md:text-lg"
          >
            Start free. Upgrade when you are ready. No hidden fees, no
            contracts, just clear visibility over your solar system.
          </motion.p>
        </div>
      </header>

      <section className="bg-background w-full px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-title1 mx-auto w-full max-w-180 leading-tight font-bold lg:text-5xl">
              Start free. <br /> <span className="text-amber-60">Upgrade</span>{" "}
              when it pays for itself.
            </h2>
          </motion.div>
        </div>

        <div className="mb-12 flex justify-center">
          <button
            type="button"
            onClick={() => setBillingPeriod("monthly")}
            className={`h-10.5 w-30 cursor-pointer rounded-l-lg px-6 py-2 text-base font-medium transition-colors ${
              billingPeriod === "monthly"
                ? "bg-secondary text-white"
                : "bg-background border border-gray-300 text-gray-900 hover:bg-gray-100"
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
                : "bg-background border border-gray-300 text-gray-900 hover:bg-gray-100"
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
              className={`flex flex-col overflow-hidden rounded-3xl p-8 transition-all md:min-h-129.75 ${
                tier.highlighted
                  ? "bg-secondary text-white shadow-2xl ring-2 ring-transparent hover:ring-amber-600"
                  : "bg-surface-20 border border-slate-200 shadow-none hover:shadow-md"
              }`}
            >
              {tier.badge && (
                <div className="mb-7 flex justify-center">
                  <span className="text-secondary bg-slate-10 inline-block rounded-full px-4 py-1.5 text-xs">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-7 flex items-baseline gap-1">
                <span className="t text-3xl font-bold tracking-tight lg:text-5xl">
                  {tier.id === "enterprise"
                    ? billingPeriod === "monthly"
                      ? (tier.customMonthlyPrice ?? tier.monthlyPrice)
                      : (tier.customYearlyPrice ?? tier.yearlyPrice)
                    : billingPeriod === "monthly"
                      ? tier.monthlyPrice
                      : tier.yearlyPrice}
                </span>

                {tier.id !== "free" && (
                  <span className="text-base font-medium md:text-2xl">
                    {tier.id === "enterprise"
                      ? billingPeriod === "monthly"
                        ? (tier.customMonthlyPeriod ?? tier.monthlyPeriod)
                        : (tier.customYearlyPeriod ?? tier.yearlyPeriod)
                      : billingPeriod === "monthly"
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
                      ? "bg-primary text-slate-10 hover:bg-amber-60"
                      : tier.ctaVariant === "outline" && tier.highlighted
                        ? "hover:border-slate-30 hover:bg-background hover:text-secondary border border-white text-white"
                        : "border-secondary text-secondary hover:bg-secondary border hover:text-white"
                  }`}
                >
                  <Link href="/signup">{tier.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Comparison Section */}
      <section className="bg-background mx-auto flex w-full max-w-360 flex-col items-center gap-2.5 px-4 pt-12 pb-12 md:px-30 md:pt-20 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-w-300 flex-col items-center gap-8 md:gap-12"
        >
          {/* Header */}
          <div className="flex flex-col items-center">
            <h2 className="w-full max-w-87.25 text-center text-3xl leading-none font-bold tracking-[-1%] text-slate-900 md:text-[48px]">
              Compare Plans
            </h2>
            <p className="mt-4 w-full max-w-94.25 text-center text-lg leading-tight font-normal tracking-[0%] text-slate-600 md:mt-6 md:text-[20px]">
              Choose the plan perfect for your journey
            </p>
          </div>

          {/* Tabular Section */}
          <div className="border-slate-30 mt-8 w-full overflow-hidden rounded-[12px] border md:mt-12">
            <div className="no-scrollbar overflow-x-auto">
              <table className="w-full min-w-200 border-collapse md:table-fixed">
                <thead>
                  <tr className="bg-slate-10">
                    <th className="text-secondary h-23.75 w-107.25 px-4 py-8 text-center text-base font-semibold">
                      Feature
                    </th>
                    <th className="text-secondary h-23.75 w-64.25 px-4 py-8 text-center text-base font-semibold">
                      Free
                    </th>
                    <th className="text-secondary h-23.75 w-64.25 px-4 py-8 text-center text-base font-semibold">
                      Pro
                    </th>
                    <th className="text-secondary h-23.75 w-64.25 px-4 py-8 text-center text-base font-semibold">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={i} className="border-slate-30 border-t">
                      <td className="h-23.75 px-4 py-8 text-center text-base font-medium text-slate-100">
                        {row.feature}
                      </td>
                      <td className="h-23.75 px-4 py-8 text-center text-base font-medium text-slate-100">
                        {row.free}
                      </td>
                      <td className="h-23.75 px-4 py-8 text-center text-base font-medium text-slate-100">
                        {row.pro}
                      </td>
                      <td className="h-23.75 px-4 py-8 text-center text-base font-medium text-slate-100">
                        {row.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </section>

      {/* (FAQ) */}
      <section className="bg-background mx-auto flex w-full max-w-360.25 flex-col items-start px-4 pt-25 pb-20 md:px-20">
        <div className="flex h-auto min-h-31 w-full max-w-320.25 flex-col items-start justify-center">
          <h2 className="w-full text-left text-3xl leading-none font-bold tracking-[-1%] text-slate-900 md:text-[48px]">
            Frequently Asked <br /> Questions
          </h2>
        </div>

        <div className="mt-12 flex w-full max-w-320.25 flex-col gap-8">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border-slate-30 flex flex-col justify-center rounded-[10px] border px-5"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenFaqIndex(openFaqIndex === index ? null : index)
                }
                aria-expanded="false"
                aria-controls="faq-panel"
                className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent py-5"
              >
                <h2 className="text-secondary text-left text-xl font-semibold">
                  {faq.question}
                </h2>
                <div className="relative shrink-0">
                  {openFaqIndex === index ? (
                    <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-black">
                      <div className="relative h-3 w-3">
                        <span className="absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 rotate-45 bg-white"></span>
                        <span className="absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 -rotate-45 bg-white"></span>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src="/images/plus.svg"
                      alt="plus"
                      width={32}
                      height={32}
                      className="size-8"
                    />
                  )}
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openFaqIndex === index && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-grey-dark pb-5">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
