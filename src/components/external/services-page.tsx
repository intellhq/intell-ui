"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import {
  BarChart3,
  BellRing,
  Bot,
  Cable,
  CheckCircle2,
  Gauge,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const coreServices = [
  {
    id: "ai-energy-agent",
    title: "AI Energy Agent",
    description:
      "Ask practical questions about battery drain, solar output, inverter behaviour, and savings without needing to interpret raw technical readings.",
    image: "/images/services_3.jpg",
    icon: Bot,
    points: [
      "Plain-language energy explanations",
      "Fault guidance based on system behaviour",
      "Decision support for homes, SMEs, and installers",
    ],
  },
  {
    id: "native-alerts",
    title: "Native Alerts",
    description:
      "Receive proactive alerts when the system detects abnormal battery, panel, load, or inverter patterns before they become expensive downtime.",
    image: "/images/services_1.jpg",
    icon: BellRing,
    points: [
      "Battery and inverter fault warnings",
      "Priority signals for urgent issues",
      "Operational visibility across connected systems",
    ],
  },
  {
    id: "cost-savings-tracker",
    title: "Cost & Savings Tracker",
    description:
      "Translate solar and inverter activity into clear financial insight so users can understand what they save compared with fuel or grid alternatives.",
    image: "/images/services_2.jpg",
    icon: BarChart3,
    points: [
      "Daily and cumulative savings visibility",
      "Energy usage trends and reports",
      "Better ROI decisions for solar investments",
    ],
  },
  {
    id: "plug-and-play-monitoring-kit",
    title: "Plug-and-Play Monitoring Kit",
    description:
      "Convert compatible non-smart or hybrid inverter setups into monitorable systems using gateway hardware, installer support, and secure data sync.",
    image: "/images/how_it_works_2.jpg",
    icon: Cable,
    points: [
      "Retrofit path for monitoring-capable systems",
      "Installer-friendly setup workflow",
      "MQTT/API-ready data pipeline for expansion",
    ],
  },
];

const serviceOutcomes = [
  {
    title: "Real-time visibility",
    description:
      "Monitor inverter, battery, load, solar generation, and system health from a single dashboard.",
    icon: Gauge,
  },
  {
    title: "Reduced downtime",
    description:
      "Catch abnormal behaviour early so issues can be handled before power interruptions affect daily life or operations.",
    icon: ShieldCheck,
  },
  {
    title: "Smarter energy decisions",
    description:
      "Use AI guidance, historical reports, and savings analytics to know what needs attention first.",
    icon: Zap,
  },
];

const featuredInverters = [
  {
    name: "Axpert",
    images: ["/images/inverters/axpert-max.svg", "/images/inverters/axpert.svg"],
  },
  {
    name: "Growatt",
    images: [
      "/images/inverters/growatt-es.svg",
      "/images/inverters/growatt-dvm.svg",
    ],
  },
  {
    name: "EG4",
    images: ["/images/inverters/eg4-ehv.svg", "/images/inverters/eg4-ex.svg"],
  },
  {
    name: "Deye",
    images: ["/images/inverters/deye-8kw.svg"],
  },
  {
    name: "Kodak",
    images: ["/images/inverters/kodak-king.svg", "/images/inverters/kodak.svg"],
  },
  {
    name: "SunSynk",
    images: ["/images/inverters/sunsynk.svg"],
  },
  {
    name: "MPP Solar",
    images: ["/images/inverters/mpp-king.svg", "/images/inverters/mpp.svg"],
  },
  {
    name: "Sol-Ark",
    images: ["/images/inverters/solark.svg"],
  },
  {
    name: "Mecer",
    images: [
      "/images/inverters/mecer-max.svg",
      "/images/inverters/axpert-max.svg",
    ],
  },
  {
    name: "RCT",
    images: ["/images/inverters/rct-green.svg", "/images/inverters/axpert.svg"],
  },
  {
    name: "MUST Power",
    images: ["/images/inverters/must-3500.svg", "/images/inverters/must-1800.svg"],
  },
  {
    name: "SRNE",
    images: ["/images/inverters/srne-hf.svg", "/images/inverters/srne-hes.svg"],
  },
  {
    name: "InfiniSolar",
    images: [
      "/images/inverters/infini-green.svg",
      "/images/inverters/axpert-green.svg",
    ],
  },
  {
    name: "Easun Power",
    images: ["/images/inverters/easun-48v.svg", "/images/inverters/easun-12v.svg"],
  },
  {
    name: "Megarevo",
    images: ["/images/inverters/megarevo.svg"],
  },
  {
    name: "Luxpower",
    images: [
      "/images/inverters/luxpower-12kw.svg",
      "/images/inverters/luxpower-5kw.svg",
    ],
  },
];

export function ServicesPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main className="flex flex-col bg-white">
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1.5 origin-left"
        style={{ scaleX }}
      />

      <section className="relative flex h-87.5 w-full items-center justify-center overflow-hidden md:h-112.5">
        <Image
          src="/images/pages.jpg"
          alt="Solar panels connected to an intelligent energy monitoring platform"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/80" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex max-w-3xl flex-col items-center px-4 text-center"
        >
          <h1 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            What INTELL offers
          </h1>
          <p className="text-base leading-relaxed text-gray-300 md:text-lg">
            INTELL helps households, businesses, and installers monitor
            inverter health, catch faults earlier, understand energy costs, and
            connect compatible systems without guesswork.
          </p>
        </motion.div>
      </section>

      <section className="bg-surface-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Services built around the energy problems users actually face.
            </h2>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed md:text-lg">
              Owners want to know if their solar system is performing, why
              batteries drain fast, how much money they are saving, and which
              site needs attention first. These services answer those questions.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {serviceOutcomes.map((outcome) => {
              const Icon = outcome.icon;
              return (
                <Card key={outcome.title} className="border-border bg-card">
                  <CardHeader>
                    <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{outcome.title}</CardTitle>
                    <CardDescription>{outcome.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8">
          {coreServices.map((service, index) => {
            const Icon = service.icon;
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={service.title}
                id={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.55 }}
                className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-2"
              >
                <div
                  className={`relative min-h-[280px] ${isReversed ? "md:order-2" : ""}`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/45 to-transparent" />
                </div>

                <div className="flex flex-col justify-center p-6 md:p-10">
                  <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-6 grid gap-3">
                    {service.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm font-medium text-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Supported <span className="text-primary">inverters</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-3xl text-base leading-relaxed md:text-lg">
            INTELL is designed around the brands and monitoring paths used by
            homes, SMEs, installers, and partner deployments across Nigeria.
          </p>
        </div>

        <div className="mt-12">
          {Array.from({ length: Math.ceil(featuredInverters.length / 4) }).map(
            (_, rowIndex) => (
              <div
                key={rowIndex}
                className={`border-y border-border/60 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-surface-50"
                }`}
              >
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-6 py-10 md:grid-cols-4 md:gap-x-8 md:gap-y-14 md:py-12">
                  {featuredInverters
                    .slice(rowIndex * 4, rowIndex * 4 + 4)
                    .map((brand) => (
                      <div
                        key={brand.name}
                        className="flex flex-col items-center justify-end text-center"
                      >
                        <div className="flex h-34 items-end justify-center -space-x-2 md:h-40">
                          {brand.images.map((image) => (
                            <div
                              key={image}
                              className="relative h-32 w-24 md:h-36 md:w-28"
                            >
                              <Image
                                src={image}
                                alt={`${brand.name} inverter`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 42vw, 16vw"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="mt-5 text-lg font-bold text-primary md:text-xl">
                          {brand.name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ),
          )}
        </div>

          <div className="mx-auto mt-12 max-w-3xl px-6 text-center">
            <h3 className="text-2xl font-bold text-foreground">
              Don&apos;t see your inverter?
            </h3>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed md:text-base">
              Many inverter models are rebranded Voltronic, Deye, Growatt, or
              Solarman-compatible systems. Check the full compatibility guide
              to see more supported brands and validation steps.
            </p>
            <Button
              asChild
              variant="link"
              className="mt-2 px-0 text-primary"
            >
              <Link href="/services/inverters">View inverter guide</Link>
            </Button>
          </div>
      </section>
    </main>
  );
}
