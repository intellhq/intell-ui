import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, CircleHelp, XCircle } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    "SolarAssistant compatible inverters",
  ],
});

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

const currentlyExcluded = [
  "ABB",
  "Ampinvt",
  "APEX/MLT",
  "Atess",
  "Enphase",
  "Epever",
  "Fronius",
  "Renogy",
  "Schneider",
  "SMA",
  "SolarEdge",
  "Solax",
  "FOXESS",
  "Outback Radian",
];

const checks = [
  {
    title: "Check the brand list first",
    description:
      "If your inverter brand is listed here or on the services page, INTELL can usually validate a connection path through API, logger, gateway, or installer setup.",
  },
  {
    title: "Check if it is a Voltronic-style inverter",
    description:
      "Many Axpert, Kodak, Mecer, MPP Solar, RCT, and InfiniSolar units are Voltronic-style systems. Similar casing, manuals, USB/RS232 ports, and WatchPower or SolarPower support are strong signs.",
  },
  {
    title: "Check if it is a Deye or Solarman-compatible system",
    description:
      "Deye, SunSynk, and many Solarman logger setups can often expose plant data through compatible monitoring paths. A WiFi/RS232 logger, touchscreen settings page, or Solarman app setup helps validation.",
  },
  {
    title: "Ask INTELL to confirm the connection path",
    description:
      "If the brand is unclear, send the model name, a photo of the inverter label, and the available ports. The team can confirm whether API, MQTT, logger, or plug-and-play hardware is the right route.",
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

      <section className="bg-surface-50 border-b border-border px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <Button asChild variant="ghost" className="-ml-3 mb-6">
            <Link href="/services">
              <ArrowLeft className="size-4" />
              Back to Services
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Is my inverter supported?
          </h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-base leading-relaxed md:text-lg">
            INTELL supports common smart, hybrid, and monitoring-capable solar
            inverter setups. Use this guide to check whether your inverter can
            connect directly, through an existing logger, or through a
            plug-and-play monitoring kit.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <CheckCircle2 className="size-5" />
              </div>
              <CardTitle>Supported and validation-ready brands</CardTitle>
              <CardDescription>
                These brands and ecosystems are the primary compatibility
                targets for INTELL onboarding and installer validation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {supportedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="rounded-lg border border-border bg-surface-50 px-3 py-2 text-sm font-medium text-foreground"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <CircleHelp className="size-5" />
                </div>
                <CardTitle>How to check compatibility</CardTitle>
                <CardDescription>
                  A practical checklist for users and installers before an
                  INTELL setup.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {checks.map((check, index) => (
                  <div key={check.title} className="flex gap-4">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="font-semibold text-foreground">
                        {check.title}
                      </h2>
                      <p className="text-muted-foreground mt-1 text-sm leading-6">
                        {check.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <XCircle className="size-5" />
                </div>
                <CardTitle>Brands that need separate validation</CardTitle>
                <CardDescription>
                  These systems are not part of the current primary support
                  path and may require a different integration approach.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentlyExcluded.map((brand) => (
                    <span
                      key={brand}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-secondary px-6 py-14 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 text-center">
          <h2 className="text-3xl font-bold">Need help confirming support?</h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
            Send your inverter brand, model number, and a photo of the ports.
            INTELL can help confirm whether your system should connect through
            an app API, logger, MQTT gateway, or installer-supported hardware.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-primary text-secondary hover:bg-primary/90">
              <Link href="/onboard">Submit inverter details</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/70 bg-white/10 text-white hover:bg-white hover:text-secondary"
            >
              <Link href="/contact">Contact INTELL</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
