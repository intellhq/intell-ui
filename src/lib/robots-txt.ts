import { SITE_URL } from "@/lib/seo";

export const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "meta-externalagent",
  "Amazonbot",
  "cohere-ai",
  "DuckAssistBot",
  "CCBot",
] as const;

export const ROBOTS_DISALLOW = [
  "/api",
  "/api/",
  "/dashboard",
  "/dashboard/",
  "/installer",
  "/installer/",
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
] as const;

function appendCrawlerRule(lines: string[], userAgent: string) {
  lines.push(`User-agent: ${userAgent}`);
  lines.push("Allow: /");

  for (const path of ROBOTS_DISALLOW) {
    lines.push(`Disallow: ${path}`);
  }

  lines.push("");
}

export function buildRobotsTxt(origin = SITE_URL) {
  const lines: string[] = [];

  appendCrawlerRule(lines, "*");

  for (const userAgent of AI_CRAWLERS) {
    appendCrawlerRule(lines, userAgent);
  }

  lines.push("# Machine-readable site summary for AI assistants");
  lines.push(`Llms-Txt: ${origin}/llms.txt`);
  lines.push("");
  lines.push(`Sitemap: ${origin}/sitemap.xml`);

  return `${lines.join("\n")}\n`;
}
