"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  title,
  subtitle,
  href,
  linkLabel = "View all",
  className,
  align = "left",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 sm:mb-10",
        align === "center" && "items-center text-center",
        href ? "sm:flex-row sm:items-end sm:justify-between" : "",
        className
      )}
    >
      <div className={cn(align === "center" && "max-w-2xl")}>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
