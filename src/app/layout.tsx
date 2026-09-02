import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

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

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Energy IQ";

const appDescription =
  "Energy IQ is a smart energy monitoring platform for tracking usage, optimizing power consumption, and improving energy efficiency.";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),

  title: {
    default: appName,
    template: `%s · ${appName}`,
  },

  description: appDescription,

  applicationName: appName,

  manifest: "/manifest.json",

  keywords: [
    "Energy monitoring",
    "Smart energy",
    "Power usage analytics",
    "Energy savings",
    "Solar monitoring",
    "Energy IQ",
  ],

  authors: [{ name: "Energy IQ Team" }],

  category: "utilities",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: appName,
  },

  openGraph: {
    title: appName,
    description:
      "Track, analyze, and optimize your energy consumption with Energy IQ.",
    url: appUrl,
    siteName: appName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${appName} — Smart Energy Monitoring`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: appName,
    description:
      "Track, analyze, and optimize your energy consumption with Energy IQ.",
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
        <QueryProvider>
          {children}

          <Toaster position="top-right" richColors />
          <ServiceWorkerRegister />
        </QueryProvider>
      </body>
    </html>
  );
}
