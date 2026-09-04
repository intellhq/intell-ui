import Blog from "@/components/external/blog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | INTELL",
  description: "Read the latest news and updates from INTELL.",
};

export default function BlogPage() {
  return (
    <div className="flex w-full flex-col">
      <Blog />
    </div>
  );
}
