"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "what-cookies-are", title: "1. What Cookies Are" },
  { id: "cookies-we-use", title: "2. Cookies We Use" },
  { id: "analytics-marketing", title: "3. Analytics & Marketing" },
  { id: "your-choices", title: "4. Your Choices" },
  { id: "browser-controls", title: "5. Browser Controls" },
  { id: "contact-us", title: "6. Contact us" },
];

export function CookiePolicy() {
  const [activeSection, setActiveSection] = useState("what-cookies-are");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries.find((entry) => entry.isIntersecting);
        if (activeEntry) setActiveSection(activeEntry.target.id);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;

    window.scrollTo({
      top: elementRect - bodyRect - offset,
      behavior: "smooth",
    });
  };

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
            Cookie Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-3xl text-base text-balance text-slate-50 md:text-lg"
          >
            How INTELL uses cookies and similar technologies to keep the
            platform working and understand product usage.
          </motion.p>
        </div>
      </header>

      <div className="bg-white">
        <main className="container mx-auto max-w-350 px-4 py-16 md:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <aside className="lg:sticky lg:top-24 lg:w-1/4">
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
            </aside>

            <div className="w-full space-y-20 lg:w-3/4 lg:pl-8">
              <PolicySection id="what-cookies-are" title="What Cookies Are">
                <p>
                  Cookies are small text files stored on your browser when you
                  visit a website. INTELL uses cookies and similar technologies
                  to keep the website and dashboard working, remember browser
                  preferences, measure page performance, and understand how
                  people interact with our AI-powered energy monitoring product.
                </p>
                <p>
                  Some cookies last only for a browsing session, while others
                  remain for a limited period so your preferences can be
                  remembered on future visits.
                </p>
              </PolicySection>

              <PolicySection id="cookies-we-use" title="Cookies We Use">
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>Functional cookies:</strong> used for app
                    preferences and interface choices. These are strictly
                    necessary and always enabled because they support expected
                    product behavior.
                  </li>
                  <li>
                    <strong>Analytics cookies:</strong> used to understand page
                    views, feature engagement, waitlist activity, dashboard
                    usage, and product performance.
                  </li>
                  <li>
                    <strong>Marketing cookies:</strong> used only when enabled
                    for campaign measurement or advertising-related activity.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection
                id="analytics-marketing"
                title="Analytics & Marketing Technologies"
              >
                <p>
                  INTELL uses Mixpanel and Google Tag Manager. GA4 is delivered
                  through Google Tag Manager, so Google Analytics configuration
                  is managed inside the GTM container.
                </p>
                <p>
                  We use these tools to measure sanitized events such as page
                  views, navigation clicks, FAQ opens, waitlist submissions,
                  pricing interactions, dashboard feature usage, alert views,
                  report actions, and installer dashboard activity. We do not
                  intentionally send passwords, emails, phone numbers, names,
                  addresses, inverter credentials, or raw user messages to
                  analytics tools.
                </p>
              </PolicySection>

              <PolicySection id="your-choices" title="Your Choices">
                <p>
                  On your first visit, you can accept all cookies, reject
                  non-essential cookies, or customize analytics and marketing
                  preferences. Analytics cookies are enabled by default for
                  public-page measurement, while marketing cookies are disabled
                  unless you accept or enable them.
                </p>
                <p>
                  You can reopen cookie preferences at any time from the Cookie
                  settings link in the website footer.
                </p>
              </PolicySection>

              <PolicySection id="browser-controls" title="Browser Controls">
                <p>
                  You can also delete or block cookies through your browser
                  settings. Browser controls vary by provider, but common
                  options are available in Chrome, Edge, Firefox, and Safari.
                  Blocking some cookies may affect login, preferences, or
                  dashboard behavior.
                </p>
              </PolicySection>

              <PolicySection id="contact-us" title="Contact Us">
                <p>
                  For questions about this Cookie Policy or INTELL&apos;s data
                  practices, contact us at contact@intell.ng.
                </p>
              </PolicySection>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
          {title}
        </h2>
        <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
          {children}
        </div>
      </motion.div>
    </section>
  );
}
