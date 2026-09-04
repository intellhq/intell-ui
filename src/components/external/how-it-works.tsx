"use client";

import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";

const StepCard = ({
  step,
  title,
  description,
  image,
  isReversed,
  height,
  imageLayout,
  isSpecialCard,
}: {
  step: string;
  title: string;
  description: string;
  image: string;
  isReversed?: boolean;
  height?: string;
  imageLayout?: {
    width: string;
    height: string;
    borderRadius: string;
    marginTop: string;
    marginBottom: string;
    padding?: string;
  };
  isSpecialCard?: boolean;
}) => {
  return (
    <div
      className="relative flex w-full max-w-[1280px] flex-col items-center justify-between gap-12 lg:flex-row lg:items-center lg:gap-24"
      style={{ minHeight: height }}
    >
      {/* Content Side */}
      <div
        className={`flex flex-1 flex-col justify-center text-center lg:text-left ${
          isReversed ? "lg:order-3" : "lg:order-1"
        }`}
      >
        <div
          className={`rounded-[12px] p-6 shadow-sm lg:p-8 ${
            isSpecialCard
              ? "border-[1px] border-[#E9EFFD] bg-white"
              : "bg-white"
          }`}
        >
          <h3 className="mb-4 font-sans text-[22px] leading-[120%] font-semibold tracking-[0%] text-slate-100 lg:text-[28px] lg:leading-[100%]">
            {title}
          </h3>
          <p className="text-grey-dark font-sans text-[16px] leading-[24px] font-medium tracking-[0%] lg:text-[18px] lg:leading-[27px]">
            {description}
          </p>
        </div>
      </div>

      <div
        className="relative z-10 hidden flex-shrink-0 flex-col items-center lg:order-2 lg:flex"
        style={{ width: "82px", minHeight: height, gap: "66px" }}
      >
        <div className="flex flex-col items-center">
          <span
            className="text-slate-60 font-sans font-semibold"
            style={{
              width: "71px",
              height: "36px",
              fontSize: "28px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
            }}
          >
            Step
          </span>
          <span
            className="font-sans font-bold text-amber-50"
            style={{
              width: "68px",
              height: "83px",
              fontSize: "64px",
              lineHeight: "100%",
              letterSpacing: "-1%",
              textAlign: "center",
            }}
          >
            {step}
          </span>
        </div>

        {step !== "03" && (
          <div
            className="border-slate-60 flex-grow border-l-[4px]"
            style={{ width: "0px" }}
          />
        )}
      </div>

      <div className="order-first mb-2 flex items-center gap-2 lg:hidden">
        <span className="text-slate-60 font-sans text-lg font-semibold">
          Step
        </span>
        <span className="font-sans text-4xl font-bold text-amber-50">
          {step}
        </span>
      </div>

      <div
        className={`flex w-full flex-1 items-center justify-center ${
          isReversed ? "lg:order-1" : "lg:order-3"
        }`}
      >
        <div
          className="relative w-full max-w-[404px] overflow-hidden"
          style={{
            height: imageLayout?.height || "400px",
            borderRadius: imageLayout?.borderRadius || "8px",
            padding: imageLayout?.padding || "0px",
          }}
        >
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              marginTop: imageLayout?.marginTop || "0px",
              marginBottom: imageLayout?.marginBottom || "0px",
            }}
          />
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover lg:object-contain"
            style={{
              borderRadius: imageLayout?.borderRadius || "8px",
            }}
            sizes="(max-width: 1024px) 100vw, 404px"
          />
        </div>
      </div>
    </div>
  );
};

export const HowItWorks = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const steps = [
    {
      step: "01",
      title: "Select your Inverter type",
      description:
        "INTELL supports multiple inverter brands used across Nigerian businesses. Select your inverter to securely sync your energy data and unlock real-time monitoring, AI-powered insights, smart alerts, and savings analytics.",
      image: "/images/how_it_works_1.jpg",
      isReversed: false,
      height: "544px",
      imageLayout: {
        width: "400px",
        height: "395px",
        borderRadius: "8px",
        marginTop: "74.5px",
        marginBottom: "74.5px",
      },
    },
    {
      step: "02",
      title: "Connect your Inverter",
      description:
        "Connect your inverter system securely using your inverter credentials or API access to begin monitoring your energy performance, battery health, solar output, generator usage, and operational savings in one intelligent dashboard.",
      image: "/images/how_it_works_2.jpg",
      isReversed: true,
      height: "544px",
      imageLayout: {
        width: "400px",
        height: "400px",
        borderRadius: "8px",
        padding: "10px",
        marginTop: "72px",
        marginBottom: "72px",
      },
    },
    {
      step: "03",
      title: "Move to Dashboard",
      description:
        "You’re all set. Your inverter has been successfully connected and INTELL is now ready to monitor your energy system in real time. Access your dashboard to track performance, receive smart alerts, analyze savings, and gain AI-powered insights into your power usage, insights, smart alerts, and savings analytics.",
      image: "/images/how_it_works_3.jpg",
      isReversed: false,
      height: "321px",
      imageLayout: {
        width: "404px",
        height: "321px",
        borderRadius: "8px",
        marginTop: "64px",
        marginBottom: "100px",
      },
      isSpecialCard: true,
    },
  ];

  return (
    <section className="w-full bg-white">
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1.5 origin-left"
        style={{ scaleX }}
      />
      <div className="bg-secondary relative h-[300px] w-full overflow-hidden md:h-[400px]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/panels.jpg')" }}
        />
        <div className="from-secondary/40 via-secondary/60 to-secondary absolute inset-0 z-10 bg-gradient-to-b" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="container-padding relative z-20 mx-auto flex h-full flex-col items-center justify-center text-center"
        >
          <h2
            className="font-sans text-[32px] leading-[100%] font-bold tracking-[-1%] text-white md:text-[48px]"
            style={{ width: "min(100%, 691px)" }}
          >
            How it works
          </h2>
          <p
            className="mt-6 font-sans text-[16px] leading-[130%] font-medium text-slate-50 md:text-[18px]"
            style={{ width: "min(100%, 691px)" }}
          >
            Connect your inverter, monitor your energy system in real time, and
            receive intelligent insights that help reduce fuel costs and improve
            performance.
          </p>
        </motion.div>
      </div>

      <div className="bg-surface-50 mx-auto flex w-full max-w-[1440px] flex-col items-center px-[20px] pb-[100px] md:px-[80px]">
        <div className="flex w-full flex-col items-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex w-full justify-center"
              style={{ marginTop: index === 0 ? "100px" : "64px" }}
            >
              <StepCard
                step={step.step}
                title={step.title}
                description={step.description}
                image={step.image}
                isReversed={step.isReversed}
                height={step.height}
                imageLayout={{
                  ...step.imageLayout,
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
                isSpecialCard={step.isSpecialCard}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
