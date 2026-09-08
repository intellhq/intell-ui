import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { createBreadcrumbJsonLd, createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Supported Solar Inverters",
  description:
    "Check INTELL inverter compatibility across Deye, Growatt, SunSynk, Axpert, Luxpower, MUST, Solarman-compatible systems, Voltronic rebrands, and other solar inverter brands.",
  path: "/services/inverters",
  keywords: [
    "supported solar inverters",
    "is my inverter supported",
    "Deye inverter monitoring",
    "Growatt inverter monitoring",
    "Voltronic inverter support",
    "Solarman inverter monitoring",
  ],
});

const toc = [
  { href: "#overview", label: "Overview" },
  { href: "#supported-brands", label: "Supported brands" },
  { href: "#connection-paths", label: "Connection paths" },
  { href: "#not-listed", label: "If your inverter is not listed" },
  { href: "#contact", label: "Confirm support" },
];

const supportedBrands = [
  "Axpert",
  "Growatt",
  "EG4",
  "Deye",
  "Kodak",
  "SunSynk",
  "MPP Solar",
  "Sol-Ark",
  "Mecer",
  "RCT",
  "MUST Power",
  "SRNE",
  "InfiniSolar",
  "Easun Power",
  "Megarevo",
  "Luxpower",
  "Victron",
  "Solis",
  "Felicity Solar",
  "Voltronic",
  "GoodWe",
  "Sungrow",
  "Huawei",
  "Solarman-compatible loggers",
  "Pylontech-compatible systems",
  "Solar-Log",
  "Elum ePowerLog",
  "Deye/Solarman rebrands",
  "Growatt ShineWiFi systems",
  "WatchPower-compatible Voltronic systems",
  "ICC-compatible Voltronic systems",
];

const connectionPaths = [
  {
    title: "Direct cloud or app integration",
    description:
      "Some inverter ecosystems already expose data through a monitoring app or logger. INTELL can use that path when the user can provide the right plant, logger, or account details.",
  },
  {
    title: "Logger or gateway setup",
    description:
      "Systems with WiFi, GPRS, RS232, RS485, USB, or CAN monitoring hardware can often be connected through a supported logger or gateway workflow.",
  },
  {
    title: "Installer-supported hardware",
    description:
      "For non-smart but compatible systems, an installer can confirm ports, wiring, and monitoring hardware before INTELL starts collecting reliable inverter data.",
  },
];

export default function SupportedInvertersPage() {
  return (
    <main className="bg-white">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "Supported Inverters", path: "/services/inverters" },
        ])}
      />

      <section className="border-b border-border bg-surface-50 px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <Button asChild variant="ghost" className="-ml-3 mb-6">
            <Link href="/services">
              <ArrowLeft className="size-4" />
              Back to Services
            </Link>
          </Button>
          <p className="mb-3 text-sm font-semibold tracking-wider text-primary uppercase">
            INTELL inverter support
          </p>
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Is my inverter supported?
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            INTELL supports common smart, hybrid, and monitoring-capable solar
            inverter setups. This guide helps users, installers, and partner
            teams understand whether a system can connect directly, through a
            logger, or through a plug-and-play monitoring kit.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-xl border border-border bg-white p-5 lg:sticky lg:top-24">
            <p className="mb-4 text-sm font-semibold text-foreground">
              On this page
            </p>
            <nav className="grid gap-3 text-sm">
              {toc.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground transition hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <article className="space-y-12">
            <section id="overview" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Compatibility depends on the brand, model, and data path.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                A supported inverter is not only about the logo on the unit.
                The model, firmware, communication ports, logger type, and
                monitoring account all matter. INTELL treats support as a
                validation process so the dashboard receives useful data instead
                of unreliable readings.
              </p>
            </section>

            <section id="supported-brands" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Supported brands and ecosystems
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                These brands and ecosystems are the main compatibility targets
                for INTELL onboarding, installer validation, and partner
                deployments.
              </p>
              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
                  {supportedBrands.map((brand) => (
                    <div
                      key={brand}
                      className="border-b border-border px-4 py-3 text-sm font-medium text-foreground last:border-b-0 sm:last:border-b lg:[&:nth-last-child(-n+3)]:border-b-0"
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="connection-paths" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                How INTELL checks the connection path
              </h2>
              <div className="mt-6 grid gap-5">
                {connectionPaths.map((path, index) => (
                  <div
                    key={path.title}
                    className="flex gap-4 border-b border-border pb-5 last:border-b-0"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {path.title}
                      </h3>
                      <p className="mt-1 leading-7 text-muted-foreground">
                        {path.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="not-listed" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                If your inverter is not listed
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Many inverter models are rebranded Voltronic, Deye, Growatt, or
                Solarman-compatible systems. If the brand name is unfamiliar,
                check the model label, monitoring app, manual, and port layout.
                Similar hardware can still be supportable even when the exact
                retail brand is not shown on the services page.
              </p>
              <ul className="mt-5 grid gap-3">
                {[
                  "Send the inverter brand and full model number.",
                  "Include a clear photo of the label and communication ports.",
                  "Mention the monitoring app or logger currently used, if any.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              id="contact"
              className="scroll-mt-28 rounded-2xl border border-border bg-surface-50 p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Need help confirming support?
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Send your inverter brand, model number, and a photo of the
                ports. INTELL can help confirm whether your system should
                connect through an app API, logger, MQTT gateway, or
                installer-supported hardware.
              </p>
              <Button
                asChild
                className="mt-6 bg-secondary text-white hover:bg-secondary/90"
              >
                <Link href="/contact">Contact INTELL</Link>
              </Button>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}
