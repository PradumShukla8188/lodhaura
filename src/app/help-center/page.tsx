"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Stethoscope, 
  Tractor, 
  Store, 
  Briefcase, 
  Users, 
  FileWarning, 
  ShoppingCart,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const helpModules = [
  {
    title: "Emergency & Health",
    description: "Get immediate access to police, fire, ambulance, and local hospitals.",
    icon: Stethoscope,
    href: "/emergency",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    title: "Report a Problem",
    description: "File complaints for water, electricity, roads, or escalate to Jansunwai.",
    icon: AlertTriangle,
    href: "/services",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Agriculture Services",
    description: "Rent tractors, buy seeds, or hire farming labor in the village.",
    icon: Tractor,
    href: "/agriculture",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Local Services Directory",
    description: "Find mechanics, electricians, grocery stores, and local businesses.",
    icon: Store,
    href: "/local-services",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Job Board",
    description: "Browse local employment opportunities or post a job opening.",
    icon: Briefcase,
    href: "/jobs",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Village Marketplace",
    description: "Buy and sell livestock, crops, and local handicrafts (Kisan Mandi).",
    icon: ShoppingCart,
    href: "/marketplace",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Find Workers",
    description: "Hire local plumbers, carpenters, and laborers directly.",
    icon: Users,
    href: "/workers",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    title: "Village Notice Board",
    description: "View important announcements from the Gram Panchayat.",
    icon: FileWarning,
    href: "/news",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function HelpCenterPage() {
  return (
    <>
      <PageHeader
        title="Village Help Center"
        subtitle="Your central hub for all community services, emergency contacts, and local opportunities."
        badge="Suvidha Kendra"
      />
      
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {helpModules.map((module) => (
              <Link href={module.href} key={module.title} className="block group">
                <Card className="glass h-full border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${module.bg}`}>
                      <module.icon className={`h-6 w-6 ${module.color}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {module.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground flex-1 mb-6">
                      {module.description}
                    </p>
                    
                    <div className="mt-auto flex items-center text-sm font-medium text-primary">
                      Access Service
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
