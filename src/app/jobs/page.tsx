"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Search, Loader2, Building2, Phone, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contentApi } from "@/lib/api-services";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { formatDistanceToNow } from "date-fns";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isPostOpen, setIsPostOpen] = useState(false);
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await contentApi.getJobs(search);
      setJobs(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchJobs();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  const onSubmitPost = async (data: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to post a job.");
      return;
    }
    setIsSubmitting(true);
    try {
      await contentApi.createJob(data);
      toast.success("Job posted successfully!");
      setIsPostOpen(false);
      reset();
      fetchJobs();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to post job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Local Job Board"
        subtitle="Find employment opportunities in and around Lodhaura"
        badge="Rozgar"
      />
      
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search job titles, skills, or companies..."
                className="pl-9 bg-background/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-strong border-white/20">
                <DialogHeader>
                  <DialogTitle>Post a Job Opportunity</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitPost)} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input {...register("title", { required: true })} placeholder="e.g. Tractor Driver, Teacher" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company/Employer Name</Label>
                      <Input {...register("companyName")} placeholder="Optional" />
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input {...register("location", { required: true })} placeholder="e.g. Lodhaura or Nearby Town" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Salary / Wages</Label>
                      <Input {...register("salary")} placeholder="e.g. 15,000/month or 400/day" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Phone *</Label>
                      <Input {...register("contactPhone", { required: true })} placeholder="10-digit number" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Job Description *</Label>
                    <Textarea {...register("description", { required: true })} placeholder="Describe the job role and responsibilities..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Requirements</Label>
                    <Textarea {...register("requirements")} placeholder="Skills or experience needed..." />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post Job"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-white/20">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No jobs found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms or check back later.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job._id} className="glass group overflow-hidden border-white/20 transition-all hover:shadow-lg hover:border-blue-500/30">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">
                          {job.title}
                        </h3>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-transparent">
                          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </Badge>
                      </div>
                      
                      {job.companyName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Building2 className="h-4 w-4" />
                          <span>{job.companyName}</span>
                        </div>
                      )}
                      
                      <p className="text-sm mb-4 line-clamp-3">
                        {job.description}
                      </p>
                      
                      {job.requirements && (
                        <div className="mb-4 text-sm bg-muted/30 p-3 rounded-lg border border-white/5">
                          <strong>Requirements:</strong> {job.requirements}
                        </div>
                      )}
                    </div>

                    <div className="md:w-64 flex flex-col justify-between gap-4 md:pl-6 md:border-l border-white/10 shrink-0">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium">{job.location}</p>
                        </div>
                        {job.salary && (
                          <div className="flex items-start gap-3">
                            <IndianRupee className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-green-500">{job.salary}</p>
                          </div>
                        )}
                      </div>
                      
                      <a href={`tel:${job.contactPhone}`} className="block w-full">
                        <Button className="w-full gap-2" variant="outline">
                          <Phone className="h-4 w-4" />
                          Call to Apply
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
