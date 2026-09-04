import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === "production";

  return {
    rules: isProd
      ? {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/api",
            "/api/",
            "/dashboard",
            "/dashboard/",
            "/super-admin",
            "/super-admin/",
            "/login",
            "/signup",
            "/forgot-password",
            "/reset-password",
            "/verify-email",
            "/onboarding",
            "/accept-invite",
            "/invites/",
            "/share/",
          ],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
