"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, badge, className, children }: PageHeaderProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border/40", className)}>
      <div className="absolute inset-0 bg-gradient-village opacity-[0.07] dark:opacity-[0.12]" />
      <div className="pointer-events-none absolute -left-20 top-0 hidden h-64 w-64 rounded-full bg-primary/15 blur-3xl sm:block" />
      <div className="pointer-events-none absolute -right-20 bottom-0 hidden h-64 w-64 rounded-full bg-accent/15 blur-3xl sm:block" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="max-w-3xl page-header-fade">
          {badge && (
            <span className="mb-3 inline-block rounded-full glass px-3 py-1 text-xs font-semibold text-primary sm:mb-4">
              {badge}
            </span>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-5 sm:mt-6">{children}</div>}
        </div>
      </div>
    </section>
  );
}
