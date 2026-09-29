import type { Metadata } from "next";

export const SITE_NAME = "INTELL";

export const SITE_URL = "https://www.intell.ng";

export const SITE_TAGLINE = "One Dashboard For Your Energy System";

export const SITE_DESCRIPTION =
  "INTELL gives homes, businesses, and installers one dashboard to monitor solar and inverter systems, receive smart alerts, track savings, and understand energy performance.";

export const DEFAULT_OG_IMAGE = "/images/request_demo_3.jpg";

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
    path: "/services",
    priority: 0.95,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/services/inverters",
    priority: 0.85,
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
    path: "/waitlist",
    priority: 0.95,
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
    path: "/cookie-policy",
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

const siteNavigation = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Supported Inverters", path: "/services/inverters" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Pricing", path: "/pricing" },
  { name: "Blog", path: "/blog" },
  { name: "Waitlist", path: "/waitlist" },
  { name: "Contact", path: "/contact" },
];

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
      alt: `${SITE_NAME} one dashboard for your energy system preview`,
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
  slogan: SITE_TAGLINE,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "contact@intell.ng",
      availableLanguage: ["English"],
    },
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: SITE_TAGLINE,
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
  alternateName: SITE_TAGLINE,
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

export const energyMonitoringServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${SITE_NAME} energy monitoring`,
  serviceType: "Solar and inverter energy monitoring",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: {
    "@type": "Country",
    name: "Nigeria",
  },
  audience: [
    { "@type": "Audience", audienceType: "Households" },
    { "@type": "Audience", audienceType: "Businesses" },
    { "@type": "Audience", audienceType: "Solar installers" },
  ],
  description: SITE_DESCRIPTION,
  offers: {
    "@type": "Offer",
    url: absoluteUrl("/pricing"),
    availability: "https://schema.org/OnlineOnly",
  },
};

export const siteNavigationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${SITE_NAME} key site links`,
  itemListElement: siteNavigation.map((item, index) => ({
    "@type": "SiteNavigationElement",
    position: index + 1,
    name: item.name,
    url: absoluteUrl(item.path),
  })),
};
