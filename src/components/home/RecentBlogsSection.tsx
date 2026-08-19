"use client";

import { motion } from "framer-motion";
import { blogs } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";
import { BlogCard } from "@/components/BlogCard";

export function RecentBlogsSection() {
  const recent = blogs.slice(0, 3);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Recent Blogs" subtitle="Stories from our community" href="/blogs" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((blog, i) => (
            <motion.div key={blog.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
