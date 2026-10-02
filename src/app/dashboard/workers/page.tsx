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

export default function WorkersPage() {
  const queryClient = useQueryClient();
  
  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-workers", page, limit, search],
    queryFn: async () => {
      const res = await governanceApi.getAdminWorkers({ page, limit, search });
      return res.data;
    },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) => governanceApi.verifyWorker(id, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-workers"] });
      toast.success("Worker verification status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update verification status");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteWorker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-workers"] });
      toast.success("Worker deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete worker");
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const workers = response?.data || [];
  const pagination = response?.pagination;

  const columns: ColumnDef<any>[] = [
    {
      header: "Worker",
      cell: (worker) => (
        <div className="flex items-center gap-3">
          <Avatar src={worker.userId?.avatar} fallback={worker.name?.[0] || "?"} className="h-9 w-9 bg-primary/10 text-primary" />
          <div>
            <p className="font-medium text-foreground">{worker.name}</p>
            <p className="text-xs text-muted-foreground">{worker.mobileNumber}</p>
          </div>
        </div>
      )
    },
    {
      header: "Category",
      cell: (worker) => (
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {worker.category}
          </span>
          {worker.skills && <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px]">{worker.skills}</p>}
        </div>
      )
    },
    {
      header: "Pricing",
      cell: (worker) => (
        <div className="text-sm">
          {worker.pricePerDay ? <p>₹{worker.pricePerDay}/day</p> : null}
          {worker.pricePerHour ? <p className="text-muted-foreground">₹{worker.pricePerHour}/hr</p> : null}
        </div>
      )
    },
    {
      header: "Verified",
      cell: (worker) => (
        <button
          onClick={() => verifyMutation.mutate({ id: worker._id, isVerified: !worker.isVerified })}
          className="transition-opacity hover:opacity-80 disabled:opacity-50"
          disabled={verifyMutation.isPending}
        >
          {worker.isVerified ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (worker) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm(`Delete worker profile for ${worker.name}?`)) {
                deleteMutation.mutate(worker._id);
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
          title="Worker Management" 
          subtitle="Manage village workers, approve listings, and oversee service providers." 
        />
      </div>

      <Card className="glass border-white/20">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Search by name, skills or category..."
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
              data={workers} 
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
