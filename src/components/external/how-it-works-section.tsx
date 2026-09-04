"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

interface Step {
  title: string;
  description: string;
  image: string;
}

interface StepCardProps extends Step {
  index: number;
}

const StepCard = ({ title, description, image, index }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      className="group overflow-hidden rounded-[12px] bg-[#111928] shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-8 pb-12">
        <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const STEPS: readonly Step[] = [
  {
    title: "Select your Inverter type",
    description: "Choose your brand and connect in minutes.",
    image: "/images/how_it_works_1.jpg",
  },
  {
    title: "Connect your Inverter",
    description:
      "Securely link your inverter to INTELL. It takes less than 5 min.",
    image: "/images/how_it_works_2.jpg",
  },
  {
    title: "Move to Dashboard",
    description:
      "Once connected, everything comes into one clean dashboard, so you stop switching between apps.",
    image: "/images/how_it_works_3.jpg",
  },
] as const;

export const HowItWorksSection = () => {
  return (
    <section className="section-padding text-foreground w-full bg-[#F7F7F799] py-16 md:py-24 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-center"
      >
        <h2 className="max-w-xl text-[32px] leading-tight font-bold md:text-[48px]">
          How it <span className="text-primary">Works</span>
        </h2>

        <Link
          href="/how-it-works"
          className="bg-primary text-secondary hover:bg-primary/90 w-fit rounded-xl px-8 font-bold inline-flex h-11 items-center justify-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Show More
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <StepCard
            key={index}
            index={index}
            title={step.title}
            description={step.description}
            image={step.image}
          />
        ))}
      </div>
    </section>
  );
};
