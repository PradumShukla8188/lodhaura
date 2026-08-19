import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Heart,
} from "lucide-react";
import { villageInfo, footerLinks } from "@/lib/village-data";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/60 bg-gradient-to-b from-background to-muted/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--primary)_0%,transparent_70%)] opacity-[0.04]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-village text-lg font-bold text-white shadow-lg">
                L
              </div>
              <div>
                <h3 className="font-bold text-foreground">Lodhaura Portal</h3>
                <p className="text-xs text-muted-foreground">Gram Panchayat Digital Hub</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {villageInfo.description.slice(0, 120)}...
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Est. {villageInfo.establishedYear}</Badge>
              <Badge variant="accent">{villageInfo.primaryLanguage}</Badge>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>
                  {villageInfo.name}, {villageInfo.district}<br />
                  {villageInfo.state} — {villageInfo.pincode}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>panchayat@lodhaura.in</span>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {year} Lodhaura Gram Panchayat. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-3.5 w-3.5 text-accent" /> for our village
          </p>
        </div>
      </div>
    </footer>
  );
}
