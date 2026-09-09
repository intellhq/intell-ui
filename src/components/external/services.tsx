"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { useAuthStore } from "@/stores/auth-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  href: string;
}

const ServiceCard = ({ title, description, image, href }: ServiceCardProps) => {
  return (
    <div className="group bg-dark-alt flex h-full flex-col overflow-hidden rounded-[12px] shadow-xl">
      <div className="relative aspect-video w-full overflow-hidden md:aspect-4/3">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="bg-secondary flex flex-1 items-center justify-between gap-4 p-8 pb-10">
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-white">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <Button
          asChild
          className="bg-primary text-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
          aria-label={`Learn more about ${title}`}
        >
          <Link href={href}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
};

const SERVICES = [
  {
    title: "AI Energy Agent",
    description: "Ask questions in plain english",
    image: "/images/services_3.jpg",
    route: "/services#ai-energy-agent",
  },
  {
    title: "Naira Savings Tracker",
    description: "Track daily savings vs diesel payback",
    image: "/images/services_2.jpg",
    route: "/services#cost-savings-tracker",
  },
  {
    title: "Native Alerts",
    description: "Get Alerts on battery and panel fault",
    image: "/images/services_1.jpg",
    route: "/services#native-alerts",
  },
] as const;

export const Services = () => {
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  const getLink = useCallback(
    (service: (typeof SERVICES)[number]) => {
      const target = service.route ?? "/coming-soon";
      if (target.startsWith("/services")) {
        return target;
      }
      if (!_hasHydrated || !isAuthenticated) {
        return `/login?redirect=${encodeURIComponent(target)}`;
      }
      return target;
    },
    [isAuthenticated, _hasHydrated],
  );

  return (
    <section className="section-padding text-foreground w-full bg-[#F7F7F799] py-16 md:py-24">
      <div className="container-padding mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"
        >
          <h2 className="max-w-xl text-[32px] leading-tight font-bold md:text-[48px]">
            Everything your <br />
            <span className="text-primary">Energy</span> System Needs
          </h2>

          <Button
            asChild
            size="lg"
            className="bg-primary text-secondary hover:bg-primary/90 w-fit rounded-xl px-8 font-bold"
          >
            <Link href="/services">View Services</Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                image={service.image}
                href={getLink(service)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
