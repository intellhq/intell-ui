import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/constants/blog-posts";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const blogRoutes = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));
  const routes = [...PUBLIC_ROUTES, ...blogRoutes];

  return routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
