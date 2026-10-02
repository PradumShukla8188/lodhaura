"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Briefcase, Loader2, Trash2, Search, CheckCircle, XCircle } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";

export default function JobsPage() {
  const queryClient = useQueryClient();
  
  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-jobs", page, limit, search],
    queryFn: async () => {
      const res = await governanceApi.getAdminJobs({ page, limit, search });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => governanceApi.updateJobStatusAdmin(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast.success("Job status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteJobAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      toast.success("Job deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const jobs = response?.data || [];
  const pagination = response?.pagination;

  const columns: ColumnDef<any>[] = [
    {
      header: "Job Role",
      cell: (job) => (
        <div className="flex items-center gap-3">
          <Avatar src={job.userId?.avatar} fallback={job.title?.[0] || "?"} className="h-9 w-9 bg-primary/10 text-primary" />
          <div>
            <p className="font-medium text-foreground">{job.title}</p>
            <p className="text-xs text-muted-foreground">{job.companyName || 'Individual'}</p>
          </div>
        </div>
      )
    },
    {
      header: "Details",
      cell: (job) => (
        <div>
          <p className="text-sm">{job.location}</p>
          <p className="text-xs text-muted-foreground">{job.salary || "Salary not specified"}</p>
        </div>
      )
    },
    {
      header: "Status",
      cell: (job) => {
        let badgeColor = "bg-primary/10 text-primary";
        if (job.status === 'filled') {
          badgeColor = "bg-green-500/10 text-green-500";
        } else if (job.status === 'inactive') {
          badgeColor = "bg-destructive/10 text-destructive";
        }

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${badgeColor}`}>
            {job.status}
          </span>
        );
      }
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (job) => (
        <div className="flex justify-end gap-2">
          {job.status !== 'active' && (
            <Button
              variant="outline"
              size="sm"
              className="text-green-500 hover:text-green-500"
              onClick={() => updateStatusMutation.mutate({ id: job._id, status: 'active' })}
              disabled={updateStatusMutation.isPending}
            >
              Activate
            </Button>
          )}
          {job.status !== 'inactive' && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => updateStatusMutation.mutate({ id: job._id, status: 'inactive' })}
              disabled={updateStatusMutation.isPending}
            >
              Deactivate
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm(`Delete job posting for ${job.title}?`)) {
                deleteMutation.mutate(job._id);
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Jobs & Applications" 
          subtitle="Manage village job postings and recruitment." 
        />
      </div>

      <Card className="glass border-white/20">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Search by job title or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-background/50"
              />
              <Button type="submit" variant="secondary" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div className="p-4">
            <DataTable 
              columns={columns} 
              data={jobs} 
              isLoading={isLoading} 
              pagination={pagination ? {
                ...pagination,
                onPageChange: setPage,
                onLimitChange: (l: number) => { setLimit(l); setPage(1); }
              } : undefined}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
