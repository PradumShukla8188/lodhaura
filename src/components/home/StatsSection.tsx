"use client";

import { motion } from "framer-motion";
import {
  Users,
  Home,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Landmark,
} from "lucide-react";
import { villageStats } from "@/lib/village-data";
import { cn } from "@/lib/utils";

const iconMap = {
  users: Users,
  home: Home,
  school: GraduationCap,
  heart: HeartPulse,
  sparkles: Sparkles,
  landmark: Landmark,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function StatsSection() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Community in Numbers
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lodhaura thrives through its people, institutions, and shared progress
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {villageStats.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.label}
                variants={item}
                className={cn(
                  "group glass rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg",
                  index % 2 === 0 ? "hover:border-primary/30" : "hover:border-accent/30"
                )}
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-village text-white shadow-md transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
