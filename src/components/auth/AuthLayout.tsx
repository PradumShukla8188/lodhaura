import Link from "next/link";
import { villageInfo } from "@/lib/village-data";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerLink?: { label: string; href: string; text: string };
}

export function AuthLayout({ title, subtitle, children, footerLink }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-village opacity-[0.06] dark:opacity-[0.1]" />
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-village text-lg font-bold text-white shadow-lg">
              L
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {villageInfo.name} Village Portal
          </p>
        </div>

        <div className="glass-strong rounded-3xl border-white/20 p-6 shadow-xl sm:p-8">
          {children}
        </div>

        {footerLink && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footerLink.text}{" "}
            <Link href={footerLink.href} className="font-medium text-primary hover:underline">
              {footerLink.label}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
