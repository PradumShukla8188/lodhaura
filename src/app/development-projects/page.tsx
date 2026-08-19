import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { developmentProjects } from "@/lib/village-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const metadata: Metadata = {
  title: "Development Projects",
  description: "Infrastructure and community development progress in Lodhaura.",
};

export default function DevelopmentProjectsPage() {
  return (
    <>
      <PageHeader
        title="Development Projects"
        subtitle="Track ongoing and completed infrastructure initiatives"
        badge="Building Progress"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {developmentProjects.map((project) => (
              <Card key={project.id} className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <Badge variant={project.status === "completed" ? "secondary" : "accent"} className="capitalize shrink-0">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-5">
                    <Progress value={project.progress} showLabel />
                  </div>
                  <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm text-muted-foreground">
                    <span>Budget: <strong className="text-foreground">{project.budget}</strong></span>
                    <span>Deadline: <strong className="text-foreground">{project.deadline}</strong></span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
