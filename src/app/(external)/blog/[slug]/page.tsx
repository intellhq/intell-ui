import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogPostDetail from "@/components/external/blog-post-detail";
import type { BlogPost } from "@/types/blog";
import { BLOG_POSTS } from "@/constants/blog-posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = BLOG_POSTS.find((p) => p.slug === slug);
  if (!entry) return { title: "Post Not Found | INTELL" };
  return {
    title: `${entry.title} | INTELL`,
    description: entry.excerpt,
  };
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

  return (
    <div className="flex w-full flex-col">
      <BlogPostDetail post={post} />
    </div>
  );
}
