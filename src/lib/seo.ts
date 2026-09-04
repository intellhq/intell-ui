import type { Metadata } from "next";

export const SITE_NAME = "INTELL";

export const SITE_URL = "https://www.intell.ng";

export const SITE_DESCRIPTION =
  "INTELL is an AI-powered energy monitoring and optimization platform for solar inverter monitoring, smart alerts, savings tracking, and multi-site energy management.";

export const DEFAULT_OG_IMAGE = "/images/hero-img.jpg";

export const SEO_KEYWORDS = [
  "solar inverter monitoring",
  "solar monitoring system",
  "inverter monitoring app",
  "energy monitoring platform",
  "AI energy management",
  "solar battery monitoring",
  "inverter fault alerts",
  "solar savings tracker",
  "energy usage dashboard",
  "multi-site energy monitoring",
  "solar performance analytics",
  "smart energy monitoring Nigeria",
  "solar monitoring software Nigeria",
  "INTELL",
];

export const PUBLIC_ROUTES = [
  {
    path: "/",
    priority: 1,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/about",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/how-it-works",
    priority: 0.9,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/pricing",
    priority: 0.9,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/blog",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/contact",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/privacy-policy",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/terms-and-conditions",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function createSeoMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const openGraphImages = [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: `${SITE_NAME} solar inverter monitoring dashboard preview`,
    },
  ];

  return {
    title,
    description,
    keywords: [...SEO_KEYWORDS, ...keywords],
    alternates: {
      canonical,
    },
    openGraph:
      type === "article"
        ? {
            title,
            description,
            url: canonical,
            siteName: SITE_NAME,
            type: "article",
            locale: "en_US",
            images: openGraphImages,
          }
        : {
            title,
            description,
            url: canonical,
            siteName: SITE_NAME,
            type: "website",
            locale: "en_US",
            images: openGraphImages,
          },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/images/logo.svg"),
  description: SITE_DESCRIPTION,
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
  },
};

export const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  featureList: [
    "Real-time solar inverter monitoring",
    "AI energy assistant",
    "Intelligent fault alerts",
    "Cost and savings tracking",
    "Multi-site energy management",
    "Energy reporting and analytics",
  ],
};
