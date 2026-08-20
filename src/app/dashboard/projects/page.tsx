"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Map, Plus, Loader2, ArrowRight } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await governanceApi.getProjects();
      return res.data;
    },
  });

  const projects = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Village Projects" 
          subtitle="Manage ongoing and completed development works." 
        />
        <Button onClick={() => router.push("/dashboard/projects/new")} className="gap-2">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Card key={project._id} className="glass hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push(`/dashboard/projects/${project._id}`)}>
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.department?.name || "No Dept"}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${project.progressPercentage === 100 ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                    {project.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 border border-white/5">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all" 
                      style={{ width: `${project.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">Budget</p>
                    <p className="text-sm font-medium text-foreground">₹{project.approvedBudget?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground font-semibold">Spent</p>
                    <p className="text-sm font-medium text-foreground">₹{project.spentAmount?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary p-0 h-auto hover:bg-transparent">
                    View Details <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed rounded-xl glass">
              No projects found. Create one to get started tracking development works.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
