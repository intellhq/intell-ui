"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, Users, Shield, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="flex flex-col bg-white">
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1.5 origin-left"
        style={{ scaleX }}
      />
      {/* Hero Section */}
      <section className="bg-secondary relative flex h-105 max-w-full items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <Image
          src="/images/pages.jpg"
          alt="Modern energy-efficient glass building"
          className="absolute h-full w-full object-cover"
          fill
          priority
        />

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-slate-900/80"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            About Us
          </h1>
          <p className="text-base font-medium text-white md:text-xl">
            Built to solve Nigeria’s energy visibility problem.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-7xl px-6 py-10 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Built to Power{" "}
          <span className="text-amber-50">Africa&apos;s Energy</span> Future
        </h2>
        <p className="text-muted-foreground mx-auto mb-16 max-w-3xl leading-relaxed">
          We started with a simple belief: every business in Nigeria deserves to
          understand and control their energy — without needing an engineer in
          the room.
        </p>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
          <StatItem label="Businesses onboarded" value="12k +" />
          <StatItem label="Energy Savings generated" value="₦4.3 M" />
          <StatItem label="Inverter brands supported" value="36+" />
          <StatItem label="Uptime guaranteed" value="96%" />
        </div>
      </motion.section>

      {/* Mission Section */}
      <section className="bg-surface-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-7xl px-6 py-8 md:px-6 md:py-20"
        >
          <div className="mb-14">
            <h2 className="mb-6 text-2xl font-bold md:text-5xl">
              Our <span className="text-amber-50">Mission</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed md:text-xl">
              Our mission is to bring energy intelligence to every Nigerian
              business by giving SMEs access to real-time energy intelligence,
              tools once reserved for large corporations, and helping reduce the
              estimated ₦3 trillion lost annually to load shedding.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MissionCard
              icon={<Clock className="h-6 w-6" />}
              title="Real time first"
              description="Insights that arrive when they matter, not after the damage is done."
            />
            <MissionCard
              icon={<Shield className="h-6 w-6" />}
              title="Data privacy"
              description="Your energy data belongs to you. We never sell or share it."
            />
            <MissionCard
              icon={<Users className="h-6 w-6" />}
              title="Built local"
              description="Designed for Nigerian grid realities, not adapted from elsewhere."
            />
            <MissionCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Always Improving"
              description="Our AI learns from every connected system to get smarter daily."
            />
          </div>
        </motion.div>
      </section>

      {/* Journey Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-7xl px-6 py-8 md:px-6 md:py-20"
      >
        <div className="mb-6">
          <h2 className="mb-4 text-2xl font-bold md:text-5xl">
            Our <span className="text-amber-50">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-4xl leading-relaxed md:text-xl">
            It started with a blackout. It became a mission. Driven by the need
            for smarter energy management, INTELL was developed to give
            organizations clear visibility into their solar energy consumption.
            By turning data into actionable insights, INTELL supports a more
            sustainable and efficient approach to energy use.
          </p>
        </div>

        <div className="border-border relative aspect-video h-105 w-full overflow-hidden rounded-2xl border shadow-lg">
          <Image
            src="/images/journey.jpg"
            alt="Solar installation"
            className="h-full w-full object-cover"
            fill
          />
        </div>
      </motion.section>

      {/* Why We Built Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-7xl px-6 py-24"
      >
        <h2 className="mb-8 text-2xl font-bold md:text-5xl">
          Why We Built <span className="text-amber-50">INTELL</span>
        </h2>
        <div className="text-muted-foreground grid gap-12 leading-relaxed md:text-xl">
          <p>
            We built INTELL because too many Nigerian businesses are losing
            money every day without understanding where their energy goes or how
            much unreliable power truly costs them. Business owners operate in
            constant uncertainty with no real visibility, no intelligent alerts,
            no actionable data, and little control over their energy usage.
          </p>
          <p>
            We watched SMEs struggle with downtime, rising fuel costs, damaged
            equipment, and operational inefficiencies while larger corporations
            had access to sophisticated energy monitoring tools. That imbalance
            should not be normal. INTELL exists to give every Nigerian
            business the power to monitor, understand, and optimize their energy
            in real time.
          </p>
        </div>
      </motion.section>
    </div>
  );
}

/* Helper Components */

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex w-full flex-col items-center justify-center text-center">
    <span className="mb-1 w-full text-center text-3xl font-bold">{value}</span>
    <span className="text-muted-foreground w-full text-center text-xs font-medium tracking-wider uppercase">
      {label}
    </span>
  </div>
);

const MissionCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="border-border bg-card ring-border h-full shadow-sm ring-1">
    <CardHeader>
      <div className="bg-surface-50 mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
        {icon}
      </div>
      <CardTitle className="text-lg font-bold">{title}</CardTitle>
      <CardDescription className="text-slate-70 text-sm leading-relaxed">
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
);
