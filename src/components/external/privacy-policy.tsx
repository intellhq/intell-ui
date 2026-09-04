"use client"

import React, { useState, useEffect } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import { cn } from "@/lib/utils"

const sections = [
  { id: "information-we-collect", title: "1. Information We Collect" },
  { id: "how-we-use-your-information", title: "2. How We Use Your Information" },
  { id: "how-we-protect-your-data", title: "3. How We Protect Your Data" },
  {
    id: "connected-inverter-systems",
    title: (
      <>
        4. Connected Inverter Systems <br /> & Third-Party Responsibility
      </>
    ),
  },
  { id: "policy-update", title: "5. Policy Update" },
  { id: "contact-us", title: "6. Contact us" },
]

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("information-we-collect")
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting)
      if (intersectingEntries.length > 0) {
        setActiveSection(intersectingEntries[0].target.id)
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

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
            Privacy Policies
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-3xl text-base text-balance text-slate-50 md:text-lg"
          >
            This policy applies only to the INTELL global website, where visitors learn
            about <br className="hidden lg:block" /> the product, connect their inverter systems, or access documentation.
          </motion.p>
        </div>
      </header>

      <div className="bg-white">
        <main className="container mx-auto max-w-350 px-4 py-16 md:px-6 lg:px-8">
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
                          : "border-slate-30 text-slate-70 hover:bg-slate-10 hover:border-slate-50 hover:text-slate-100"
                      )}
                    >
                      <span
                        className={cn(
                          "transition-transform duration-200 group-hover:translate-x-1",
                          activeSection === section.id && "translate-x-1"
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
              {/* 1. Information We Collect */}
              <section id="information-we-collect" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Information We Collect
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <div>
                      <h3 className="text-slate-80 mb-2">
                        Information You Provide Voluntarily When interacting with our
                        landing page, you may provide:
                      </h3>
                      <ul className="list-disc space-y-1 pl-6">
                        <li>
                          Contact information (e.g., your name, email) when submitting
                          forms.
                        </li>
                        <li>
                          Feedback or inquiries sent through our support or contact
                          sections.
                        </li>
                      </ul>
                      <p className="mt-2">
                        This information is only collected when you choose to provide it.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-slate-80 mb-2">
                        Automatically Collected Information When you visit the INTELL
                        landing page, we may automatically collect:
                      </h3>
                      <ul className="list-disc space-y-1 pl-6">
                        <li>IP address</li>
                        <li>Browser type and version</li>
                        <li>Device type</li>
                        <li>Pages visited and time spent</li>
                        <li>Referring websites</li>
                        <li>Basic analytics for performance and security</li>
                      </ul>
                      <p className="mt-2">
                        This data is strictly aggregated and used only to understand
                        website performance and improve user experience.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-slate-80 mb-2">
                        Cookies &amp; Tracking Technologies We may use minimal cookies
                        for:
                      </h3>
                      <ul className="list-disc space-y-1 pl-6">
                        <li>Session management</li>
                        <li>Basic website analytics</li>
                        <li>Improving site loading performance</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 2. How We Use Your Information */}
              <section id="how-we-use-your-information" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    How We Use Your Information
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <div>
                      <h3 className="text-slate-80 mb-2">
                        We use the information collected on the INTELL landing page to:
                      </h3>
                      <ul className="list-disc space-y-1 pl-6">
                        <li>Provide product information and onboarding guidance</li>
                        <li>Display documentation and support content</li>
                        <li>Improve website experience and performance</li>
                        <li>Respond to inquiries or support requests</li>
                        <li>Prevent abuse, spam, and security threats</li>
                      </ul>
                      <p className="mt-2">
                        We do not sell or share visitor data with third parties for
                        marketing or advertising.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 3. How We Protect Your Data */}
              <section id="how-we-protect-your-data" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-8 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    How We Protect Your Data
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <div>
                      <h3 className="text-slate-80 mb-2">
                        We take data protection seriously and implement:
                      </h3>
                      <ul className="list-disc space-y-1 pl-6">
                        <li>HTTPS encryption</li>
                        <li>Secure form submissions</li>
                        <li>Firewall and anti-bot protection</li>
                        <li>Regular site monitoring and logging</li>
                      </ul>
                      <p className="mt-2">
                        The INTELL landing page does not store sensitive personal data,
                        login credentials, or inverter system data.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 4.  Connected Inverter Systems & Third-Party Responsibility */}
              <section id="connected-inverter-systems" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Connected Inverter Systems & Third-Party Responsibility
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <div>
                      <h3 className="text-slate-80 mb-2">
                        INTELL connects to third-party inverter brand cloud APIs (such
                        as Victron VRM, Growatt OpenAPI, and Solarman) to retrieve energy
                        data on behalf of the user.
                      </h3>
                      <p className="text-slate-80">This means:</p>
                      <ul className="list-disc space-y-1 pl-6">
                        <li>
                          Each user authorizes INTELL to access their inverter data
                          using credentials they provide
                        </li>
                        <li>
                          INTELL retrieves and stores this data solely to power the
                          platform&apos;s features
                        </li>
                        <li>
                          INTELL does not share inverter credentials or energy data with
                          any third party
                        </li>
                        <li>
                          Users are responsible for ensuring their inverter brand account
                          credentials remain secure
                        </li>
                        <li>
                          Users whose inverter brands do not have a cloud API are
                          responsible for the accuracy of any manually entered data
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 5. Policy Update */}
              <section id="policy-update" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-8 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Policy Update
                  </h2>
                  <div className="text-md text-slate-80 space-y-6 leading-relaxed md:text-lg">
                    <div>
                      <h3 className="text-slate-80 mb-2">
                        We may update this Privacy Policy periodically.
                      </h3>
                      <ul className="list-disc space-y-1 pl-6">
                        <li>
                          The &quot;Last Updated&quot; date at the top will reflect
                          changes.
                        </li>
                        <li>
                          Continued use of the landing page constitutes acceptance of
                          updated terms.
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* 6. Contact Us */}
              <section id="contact-us" className="scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-100 lg:text-2xl">
                    Contact Us
                  </h2>
                  <div className="text-md text-slate-80 leading-relaxed md:text-lg">
                    <p className="mb-4">
                      For questions regarding this policy, please contact: INTELL -
                      Privacy Team Email: support@INTELL.com
                    </p>
                  </div>
                </motion.div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PrivacyPolicy
