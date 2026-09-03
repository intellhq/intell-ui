"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "definitions", title: "2. Definitions" },
  { id: "user-accounts", title: "3. User Accounts" },
  { id: "platform-usage", title: "4. Platform Usage" },
  { id: "energy-data", title: "5. Energy & System Data" },
  { id: "inverter-connections", title: "6. Inverter Connections & Records" },
  { id: "reports", title: "7. Energy Data & Reports" },
  { id: "communication", title: "8. Communication & Alerts" },
  { id: "availability", title: "9. System Availability" },
  { id: "intellectual-property", title: "10. Intellectual Property" },
  { id: "suspension", title: "11. Suspension or Termination of Use" },
  { id: "liability", title: "12. Limitation of Liability" },
  { id: "changes", title: "13. Changes to Terms" },
  { id: "contact", title: "14. Contact" },
];

const TermsAndCondition = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting,
      );
      if (intersectingEntries.length > 0) {
        setActiveSection(intersectingEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-background selection:bg-amber-10 min-h-screen font-sans text-slate-100 selection:text-amber-800">
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1.5 origin-left"
        style={{ scaleX }}
      />
      <header className="bg-secondary relative h-[300px] w-full overflow-hidden md:h-[400px]">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/panels.jpg')" }}
        />
        <div className="from-secondary/40 via-secondary/60 to-secondary absolute inset-0 z-10 bg-gradient-to-b" />

        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-5xl"
          >
            Terms and Conditions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-3xl text-base text-balance text-slate-50 md:text-lg"
          >
            Welcome to INTELL, an AI-powered energy monitoring and management
            platform. By using INTELL, you agree to the following Terms &
            Conditions.
          </motion.p>
        </div>
      </header>

      <div className="bg-white">
        <main className="container mx-auto max-w-[1400px] px-4 py-16 md:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <aside className="lg:sticky lg:top-24 lg:w-1/4">
              <div className="border-none bg-white shadow-none lg:bg-transparent lg:p-0">
                <h2 className="mb-6 text-lg font-bold tracking-wider text-slate-900 uppercase lg:text-xl">
                  Table of content
                </h2>
                <nav className="flex flex-col space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "group flex items-center border-l-2 py-2.5 pl-4 text-left text-sm transition-all duration-200",
                        activeSection === section.id
                          ? "border-primary bg-amber-10 text-primary font-semibold"
                          : "border-slate-30 text-slate-70 hover:bg-slate-10 hover:border-slate-50 hover:text-slate-100",
                      )}
                    >
                      <span
                        className={cn(
                          "transition-transform duration-200 group-hover:translate-x-1",
                          activeSection === section.id && "translate-x-1",
                        )}
                      >
                        {section.title}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content Sections */}
            <div className="w-full space-y-20 lg:w-3/4 lg:pl-8">
              {/* 1. Acceptance of Terms */}
              <section id="acceptance" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Acceptance of Terms
                  </h2>
                  <div className="text-md text-slate-80 leading-relaxed md:text-lg">
                    <p>
                      By accessing or using INTELL, you confirm that you have
                      read, understood, and agreed to these Terms & Conditions.
                      If you do not agree, you must discontinue use immediately.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 2. Definitions */}
              <section id="definitions" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Definitions
                  </h2>
                  <div className="text-md text-slate-80 space-y-4 leading-relaxed md:text-lg">
                    <p>
                      <span className="font-semibold text-slate-100">
                        &apos;INTELL&apos;
                      </span>{" "}
                      – The INTELL energy monitoring and management platform.
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">
                        &apos;Organization&apos;
                      </span>{" "}
                      – The business, household, or solar company using
                      INTELL.
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">
                        &apos;Users&apos;
                      </span>{" "}
                      – Admins, Owners, and Members authorized by the
                      organization.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 3. User Accounts */}
              <section id="user-accounts" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-8 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    User Accounts
                  </h2>
                  <div className="text-md text-slate-80 space-y-8 leading-relaxed md:text-lg">
                    <div className="">
                      <h3 className="mb-3 text-lg font-bold text-slate-100">
                        Account Creation
                      </h3>
                      <p>
                        User accounts are created by the account owner.
                        Additional members may be invited and managed by the
                        account owner.
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-3 text-lg font-bold text-slate-100">
                        Accurate Information
                      </h3>
                      <p>
                        Users must provide accurate details. The account owner
                        is responsible for maintaining correct user data.
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-3 text-lg font-bold text-slate-100">
                        Security
                      </h3>
                      <p>
                        Users are responsible for keeping their login
                        credentials secure. INTELL is not liable for
                        unauthorized access resulting from weak or shared
                        passwords.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 4. Platform Usage */}
              <section id="platform-usage" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Platform Usage
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <p>
                      Users agree to use INTELL only for legitimate energy
                      monitoring and management activities. Users must NOT:
                    </p>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {[
                        "Disrupt or harm system operations",
                        "Upload malicious files",
                        "Attempt to access features or data outside their role",
                        "Tamper with energy records or system data",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-amber-80 py-2 text-sm italic">
                      Misuse may lead to restricted access.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 5. Energy & System Data */}
              <section id="energy-data" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-8 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Energy & System Data
                  </h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-100">
                        Data Ownership
                      </h3>
                      <p className="text-slate-80">
                        All energy, system, and usage data belongs solely to the
                        account owner.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-100">
                        Data Usage
                      </h3>
                      <p className="text-slate-80">
                        INTELL only processes data for the purpose of enabling
                        the platform&apos;s features (energy monitoring, savings
                        calculations, alerts, AI insights, reports, etc.).
                      </p>
                    </div>
                    <div className="col-span-full space-y-4">
                      <h3 className="text-xl font-bold text-slate-100">
                        Data Protection
                      </h3>
                      <p className="text-slate-80">
                        The platform uses encrypted connections, secure login,
                        and activity logs to help protect your data.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 6. Inverter Connections & Records */}
              <section id="inverter-connections" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Inverter Connections & Records
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <p className="font-medium text-slate-100 italic">
                      If the user connects a smart inverter system:
                    </p>
                    <div className="space-y-4">
                      {[
                        "Data is fetched automatically from the inverter brand's cloud API at regular intervals",
                        "Offline data syncs when the connection is restored",
                        "Users may update manual entries with accurate readings",
                        "All changes are logged for transparency",
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="border-slate-20 flex items-center gap-4 border-b pb-4 last:border-0"
                        >
                          <div className="rounded-fulltext-sm text-amber-90 flex h-8 w-8 shrink-0 items-center justify-center font-bold">
                            {i + 1}
                          </div>
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 7. Energy Data & Reports */}
              <section id="reports" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Energy Data & Reports
                  </h2>
                  <div className="text-md text-slate-80 leading-relaxed md:text-lg">
                    <p className="mb-4">
                      INTELL displays energy data sourced from connected
                      inverter systems or user-entered readings. Savings
                      estimates and carbon offset figures are calculated based
                      on standard formulas and user-provided inputs.
                    </p>
                    <div className="">
                      <p className="text-secondary mb-4">
                        These are estimates and should not be treated as audited
                        financial records.
                      </p>
                      <p className="text-secondary">
                        Users must not manipulate energy records outside
                        approved workflows.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 8. Communication & Alerts */}
              <section id="communication" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Communication & Alerts
                  </h2>
                  <div className="text-md text-slate-80 leading-relaxed md:text-lg">
                    <p className="mb-6 text-balance">
                      INTELL sends alerts and notifications to users via
                      WhatsApp and in-app notifications. It is the user&apos;s
                      responsibility to ensure their contact details and
                      WhatsApp number are correct and up to date.
                    </p>
                    <p className="text-balance">
                      INTELL is not responsible for undelivered messages
                      caused by incorrect user-provided information or external
                      service issues.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 9. System Availability */}
              <section id="availability" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    System Availability
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <p>
                      INTELL aims to provide reliable access; however,
                      availability may be affected by:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Maintenance",
                        "Technical faults",
                        "Network or connectivity issues on the user's device or inverter system",
                        "Third-party inverter brand API availability",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          {/* <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg> */}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-semibold text-slate-100">
                      The platform will make reasonable efforts to restore
                      access promptly.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 10. Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Intellectual Property
                  </h2>
                  <div className="text-md text-slate-80 leading-relaxed md:text-lg">
                    <p className="mb-4">
                      All software, designs, content, and features of INTELL
                      are the property of the platform provider.
                    </p>
                    <p className="">
                      Users may not copy, resell, distribute, or
                      reverse-engineer any part of the system.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 11. Suspension or Termination of Use */}
              <section id="suspension" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Suspension or Termination of Use
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <p className="text-balance">
                      INTELL may suspend access if:
                    </p>
                    <ul className="space-y-4">
                      {[
                        "The user breaches these terms",
                        "Unauthorized system tampering occurs",
                        "Use threatens platform security or performance",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                          {/* <svg className="h-6 w-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg> */}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-slate-70">
                      Users may discontinue use of INTELL at any time.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 12. Limitation of Liability */}
              <section id="liability" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Limitation of Liability
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <p className="text-balance">
                      INTELL is provided &apos;as-is.&apos; The platform is
                      not responsible for:
                    </p>
                    <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
                      {[
                        "Errors caused by incorrect data entered by the user",
                        "Unauthorized access due to weak passwords",
                        "External network or inverter API failures",
                        "Financial or operational decisions made based on data within the system",
                        "Inaccuracies in savings estimates resulting from fluctuating fuel prices or user-entered inputs",
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          {/* <svg className="h-6 w-6 shrink-0 text-slate-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg> */}
                          <span className="text-base">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="font-bold text-slate-100 italic">
                      Use of the system is at the user&apos;s discretion.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 13. Changes to Terms */}
              <section id="changes" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Changes to Terms
                  </h2>
                  <div className="text-md text-slate-80 leading-relaxed md:text-lg">
                    <p>
                      We may update these Terms & Conditions. The revised
                      version will be effective once posted or communicated to
                      users. Continued use of INTELL indicates acceptance of
                      the updated terms.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* 14. Contact */}
              <section id="contact" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Contact
                  </h2>
                  <div className="">
                    <p className="text-md mb-6 font-medium opacity-90 md:text-lg">
                      For support or concerns regarding INTELL, please contact
                      your designated platform representative or support
                      channel.
                    </p>
                  </div>
                </motion.div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsAndCondition;
