"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShoppingCart, Loader2, Trash2, Search, Tag, EyeOff, Eye } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable, ColumnDef } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";

export default function MarketplacePage() {
  const queryClient = useQueryClient();
  
  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-marketplace", page, limit, search],
    queryFn: async () => {
      const res = await governanceApi.getAdminMarketplaceItems({ page, limit, search });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => governanceApi.updateMarketplaceItemStatusAdmin(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-marketplace"] });
      toast.success("Item status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteMarketplaceItemAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-marketplace"] });
      toast.success("Item deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const items = response?.data || [];
  const pagination = response?.pagination;

  const columns: ColumnDef<any>[] = [
    {
      header: "Item Info",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar src={item.photos?.[0]} fallback={item.itemName?.[0] || "?"} className="h-10 w-10 bg-primary/10 text-primary rounded-md" />
          <div>
            <p className="font-medium text-foreground">{item.itemName}</p>
            <p className="text-xs text-muted-foreground">{item.category}</p>
          </div>
        </div>
      )
    },
    {
      header: "Seller & Price",
      cell: (item) => (
        <div>
          <p className="text-sm font-medium">₹{item.price}</p>
          <p className="text-xs text-muted-foreground">{item.sellerName} ({item.contactPhone})</p>
        </div>
      )
    },
    {
      header: "Status",
      cell: (item) => {
        let badgeColor = "bg-primary/10 text-primary";
        if (item.status === 'sold') {
          badgeColor = "bg-green-500/10 text-green-500";
        } else if (item.status === 'hidden') {
          badgeColor = "bg-muted text-muted-foreground";
        }

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${badgeColor}`}>
            {item.status}
          </span>
        );
      }
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (item) => (
        <div className="flex justify-end gap-2">
          {item.status !== 'available' && (
            <Button
              variant="outline"
              size="sm"
              className="text-green-500 hover:text-green-500"
              onClick={() => updateStatusMutation.mutate({ id: item._id, status: 'available' })}
              disabled={updateStatusMutation.isPending}
            >
              <Eye className="h-4 w-4 mr-2" /> Show
            </Button>
          )}
          {item.status !== 'hidden' && (
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-muted-foreground"
              onClick={() => updateStatusMutation.mutate({ id: item._id, status: 'hidden' })}
              disabled={updateStatusMutation.isPending}
            >
              <EyeOff className="h-4 w-4 mr-2" /> Hide
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm(`Delete marketplace item ${item.itemName}?`)) {
                deleteMutation.mutate(item._id);
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
          title="Marketplace Listings" 
          subtitle="Manage village marketplace items, crops, and equipment." 
        />
      </div>

      <Card className="glass border-white/20">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Search by item name or description..."
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
              data={items} 
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
