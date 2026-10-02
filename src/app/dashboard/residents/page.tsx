"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Loader2, Trash2, Search, Home } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";

export default function ResidentsPage() {
  const queryClient = useQueryClient();
  
  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-residents", page, limit, search],
    queryFn: async () => {
      const res = await governanceApi.getAdminResidents({ page, limit, search });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteResidentAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-residents"] });
      toast.success("Resident deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete resident");
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const residents = response?.data || [];
  const pagination = response?.pagination;

  const columns: ColumnDef<any>[] = [
    {
      header: "Resident",
      cell: (profile) => (
        <div className="flex items-center gap-3">
          <Avatar src={profile.userId?.avatar} fallback={profile.userId?.name?.[0] || "?"} className="h-9 w-9 bg-primary/10 text-primary" />
          <div>
            <p className="font-medium text-foreground">{profile.userId?.name || profile.familyHeadName}</p>
            <p className="text-xs text-muted-foreground">{profile.userId?.email || profile.userId?.phone || "No contact info"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Household Info",
      cell: (profile) => (
        <div>
          <p className="text-sm flex items-center gap-1.5"><Home className="w-3.5 h-3.5" /> House {profile.houseNumber}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{profile.street}</p>
        </div>
      )
    },
    {
      header: "Occupation / Edu",
      cell: (profile) => (
        <div className="text-sm">
          <p>{profile.occupation || "Not specified"}</p>
          <p className="text-xs text-muted-foreground">{profile.educationLevel || "Not specified"}</p>
        </div>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (profile) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm(`Delete resident profile for ${profile.userId?.name || profile.familyHeadName}?`)) {
                deleteMutation.mutate(profile._id);
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
          title="Resident Management" 
          subtitle="View and manage all registered village residents and their household details." 
        />
      </div>

      <Card className="glass border-white/20">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Search by house number or family head name..."
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
              data={residents} 
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
