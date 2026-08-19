"use client";

import Link from "next/link";
import { developmentProjects } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function DevelopmentProgressSection() {
  const projects = developmentProjects.filter((p) => p.status === "ongoing").slice(0, 3);

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Development Progress" subtitle="Infrastructure & community projects" href="/development-projects" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href="/development-projects">
              <Card className="glass h-full border-white/20 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    <Badge variant="secondary" className="shrink-0 capitalize">{project.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-4">
                    <Progress value={project.progress} showLabel />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>Budget: {project.budget}</span>
                    <span>Due: {project.deadline}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
