"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { villageInfo } from "@/lib/village-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-village opacity-[0.08] dark:opacity-[0.15]" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge variant="glass" className="gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Welcome to {villageInfo.name}
            </Badge>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="text-gradient-village">
                {villageInfo.name}
              </span>{" "}
              Village Portal
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              {villageInfo.tagline}. Connect with your community, explore local
              services, events, and the rich heritage of {villageInfo.district},{" "}
              {villageInfo.state}.
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {villageInfo.district}, {villageInfo.state} • PIN {villageInfo.pincode}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/gallery">
                <Button size="lg" className="gap-2">
                  Explore Village
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/donation">
                <Button variant="outline" size="lg">
                  Donate
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-strong relative overflow-hidden rounded-3xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-village opacity-10" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Village at a Glance</h3>
                  <Badge variant="accent">Live Portal</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Population", value: villageInfo.population.toLocaleString() },
                    { label: "Households", value: villageInfo.households },
                    { label: "Area", value: villageInfo.area },
                    { label: "Since", value: villageInfo.establishedYear },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl bg-background/60 p-4 backdrop-blur-sm"
                    >
                      <p className="text-2xl font-bold text-primary">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                <ul className="space-y-2">
                  {villageInfo.highlights.slice(0, 3).map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 shadow-lg">
              <p className="text-xs text-muted-foreground">Heritage</p>
              <p className="text-lg font-bold text-accent">170+ Years</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
