import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { JsonLd } from "@/components/seo/json-ld";
import {
  DEFAULT_OG_IMAGE,
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appName = SITE_NAME;
const defaultImage = absoluteUrl(DEFAULT_OG_IMAGE);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${appName} | AI Solar Inverter Monitoring Platform`,
    template: `%s | ${appName}`,
  },

  description: SITE_DESCRIPTION,

  applicationName: appName,

  manifest: "/manifest.json",

  keywords: SEO_KEYWORDS,

  authors: [{ name: "INTELL Team" }],
  creator: "INTELL",
  publisher: "INTELL",

  category: "utilities",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: appName,
  },

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: `${appName} | AI Solar Inverter Monitoring Platform`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: appName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: "INTELL solar inverter monitoring dashboard preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${appName} | AI Solar Inverter Monitoring Platform`,
    description: SITE_DESCRIPTION,
    images: [defaultImage],
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5a623" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        figtree.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={[organizationJsonLd, websiteJsonLd, softwareApplicationJsonLd]}
        />
        <QueryProvider>
          {children}

          <Toaster position="top-right" richColors />
          <ServiceWorkerRegister />
        </QueryProvider>
      </body>
    </html>
  );
}
