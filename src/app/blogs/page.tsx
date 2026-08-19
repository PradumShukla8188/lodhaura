import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { BlogCard } from "@/components/BlogCard";
import { blogs } from "@/lib/village-data";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Stories and updates from Lodhaura village community.",
};

export default function BlogsPage() {
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <>
      <PageHeader
        title="Village Blogs"
        subtitle="Medium-style stories from our community — agriculture, culture, education and progress"
        badge="Read & Reflect"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <BlogCard blog={featured} featured />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
