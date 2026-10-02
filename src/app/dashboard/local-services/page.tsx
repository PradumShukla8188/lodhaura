"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Store, Loader2, Trash2, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";

export default function LocalServicesPage() {
  const queryClient = useQueryClient();
  
  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-local-services", page, limit, search],
    queryFn: async () => {
      const res = await governanceApi.getAdminLocalServices({ page, limit, search });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, verificationStatus }: { id: string; verificationStatus: string }) => governanceApi.updateLocalServiceStatusAdmin(id, verificationStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-local-services"] });
      toast.success("Service verification status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteLocalServiceAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-local-services"] });
      toast.success("Service deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete service");
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const services = response?.data || [];
  const pagination = response?.pagination;

  const columns: ColumnDef<any>[] = [
    {
      header: "Business Name",
      cell: (service) => (
        <div className="flex items-center gap-3">
          <Avatar src={service.photos?.[0]} fallback={service.businessName?.[0] || "?"} className="h-10 w-10 bg-primary/10 text-primary rounded-md" />
          <div>
            <p className="font-medium text-foreground">{service.businessName}</p>
            <p className="text-xs text-muted-foreground">{service.category}</p>
          </div>
        </div>
      )
    },
    {
      header: "Contact Info",
      cell: (service) => (
        <div>
          <p className="text-sm">{service.phone}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{service.address}</p>
        </div>
      )
    },
    {
      header: "Status",
      cell: (service) => {
        let badgeColor = "bg-yellow-500/10 text-yellow-500";
        let Icon = Clock;
        
        if (service.verificationStatus === 'approved') {
          badgeColor = "bg-green-500/10 text-green-500";
          Icon = CheckCircle;
        } else if (service.verificationStatus === 'rejected') {
          badgeColor = "bg-destructive/10 text-destructive";
          Icon = XCircle;
        }

        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            <Icon className="h-3.5 w-3.5" />
            <span className="capitalize">{service.verificationStatus}</span>
          </span>
        );
      }
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (service) => (
        <div className="flex justify-end gap-2">
          {service.verificationStatus !== 'approved' && (
            <Button
              variant="outline"
              size="sm"
              className="text-green-500 hover:text-green-500"
              onClick={() => updateStatusMutation.mutate({ id: service._id, verificationStatus: 'approved' })}
              disabled={updateStatusMutation.isPending}
            >
              Approve
            </Button>
          )}
          {service.verificationStatus !== 'rejected' && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => updateStatusMutation.mutate({ id: service._id, verificationStatus: 'rejected' })}
              disabled={updateStatusMutation.isPending}
            >
              Reject
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm(`Delete business ${service.businessName}?`)) {
                deleteMutation.mutate(service._id);
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
          title="Local Services Management" 
          subtitle="Manage and approve local businesses and service providers in the village." 
        />
      </div>

      <Card className="glass border-white/20">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Search by business name or category..."
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
              data={services} 
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
