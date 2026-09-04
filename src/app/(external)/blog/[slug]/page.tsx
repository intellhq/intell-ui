import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogPostDetail from "@/components/external/blog-post-detail";
import type { BlogPost } from "@/types/blog";
import { BLOG_POSTS } from "@/constants/blog-posts";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SITE_NAME,
  absoluteUrl,
  createBreadcrumbJsonLd,
  createSeoMetadata,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = BLOG_POSTS.find((p) => p.slug === slug);
  if (!entry) {
    return {
      title: "Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return createSeoMetadata({
    title: entry.title,
    description: entry.excerpt,
    path: `/blog/${entry.slug}`,
    image: entry.image,
    type: "article",
    keywords: [entry.category, entry.title],
  });
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = BLOG_POSTS.find((p) => p.slug === slug);
  if (!entry) notFound();

  const post: BlogPost = {
    slug: entry.slug,
    image: entry.image,
    category: entry.category,
    title: entry.title,
    excerpt: entry.excerpt,
    toc: entry.toc,
    content: entry.content,
  };

  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.excerpt,
    image: absoluteUrl(entry.image),
    url: absoluteUrl(`/blog/${entry.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${entry.slug}`),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/logo.svg"),
      },
    },
  };

  return (
    <div className="flex w-full flex-col">
      <JsonLd
        data={[
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: entry.title, path: `/blog/${entry.slug}` },
          ]),
          blogPostJsonLd,
        ]}
      />
      <BlogPostDetail post={post} />
    </div>
  );
}
