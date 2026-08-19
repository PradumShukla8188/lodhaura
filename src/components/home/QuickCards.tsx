"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Camera,
  FileText,
  Newspaper,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { quickLinks } from "@/lib/village-data";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const iconMap = {
  book: BookOpen,
  calendar: Calendar,
  camera: Camera,
  file: FileText,
  newspaper: Newspaper,
  phone: Phone,
};

export function QuickCards() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Quick Access
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Everything you need — directory, events, services, and panchayat updates in one place
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link, index) => {
            const Icon = iconMap[link.icon];
            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <Link href={link.href} className="group block h-full">
                  <Card className="glass h-full overflow-hidden border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                    <div
                      className={cn(
                        "h-1.5 w-full bg-gradient-to-r",
                        link.gradient
                      )}
                    />
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                            link.gradient
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                      <CardTitle className="pt-3">{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Open →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
