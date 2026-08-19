import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Blog } from "@/lib/village-data";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
  className?: string;
}

export function BlogCard({ blog, featured, className }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog.slug}`} className={cn("group block", className)}>
      <Card className="glass h-full overflow-hidden border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className={cn("relative overflow-hidden", featured ? "h-56" : "h-44")}>
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {blog.tags?.[0] && (
            <Badge variant="accent" className="absolute left-3 top-3">
              {blog.tags[0]}
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className={cn("font-semibold text-foreground group-hover:text-primary", featured ? "text-xl" : "text-base")}>
            {blog.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{blog.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {blog.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(blog.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {blog.readTime}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
