import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getBlogBySlug, blogs } from "@/lib/village-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) return { title: "Blog Not Found" };
  return { title: blog.title, description: blog.excerpt };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);
  if (!blog) notFound();

  return (
    <article>
      <div className="relative h-64 sm:h-80 lg:h-96">
        <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/blogs">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            All Blogs
          </Button>
        </Link>

        <div className="flex flex-wrap gap-2">
          {blog.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{blog.title}</h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-4 w-4" />{blog.author}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{blog.readTime}</span>
        </div>

        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
          {blog.content.split("\n\n").map((para, i) => (
            <p key={i} className="mb-4 leading-relaxed text-muted-foreground">{para}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
