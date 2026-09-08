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

      <section className="bg-secondary relative flex min-h-[420px] items-center overflow-hidden">
        <Image
          src="/images/panels.jpg"
          alt="Solar panels connected to an intelligent energy monitoring platform"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="container-padding relative z-10 mx-auto w-full max-w-7xl py-20 text-center md:py-28"
        >
          <h1 className="mx-auto max-w-4xl text-4xl leading-tight font-bold text-white md:text-6xl">
            Services
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-100 md:text-xl">
            Make your inverter smarter with AI monitoring, native alerts, cost
            visibility, and plug-and-play support for compatible solar systems.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-primary text-secondary hover:bg-primary/90 rounded-xl px-8 font-bold"
            >
              <Link href="/onboard">Onboard your inverter</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl border-white/70 bg-white/10 px-8 font-bold text-white hover:bg-white hover:text-secondary"
            >
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="bg-surface-50 px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-semibold tracking-wider text-primary uppercase">
              What INTELL does
            </p>
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

      <section className="bg-white px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold tracking-wider text-primary uppercase">
              Select your inverter
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Multi-brand support for common solar inverter setups.
            </h2>
            <p className="text-muted-foreground mt-5 text-base leading-relaxed md:text-lg">
              INTELL is designed around the brands and monitoring paths used by
              homes, SMEs, installers, and partner deployments across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredInverters.map((brand) => (
              <div
                key={brand.name}
                className="group flex min-h-56 flex-col items-center justify-between rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
              >
                <div className="flex h-34 w-full items-center justify-center gap-2">
                  {brand.images.map((image) => (
                    <div key={image} className="relative h-30 flex-1">
                      <Image
                        src={image}
                        alt={`${brand.name} inverter`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 40vw, 14vw"
                      />
                    </div>
                  ))}
                </div>
                <span className="mt-4 text-lg font-bold text-foreground">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-surface-50 p-6 text-center">
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
              className="mt-5 bg-secondary text-white hover:bg-secondary/90"
            >
              <Link href="/services/inverters">View inverter guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
