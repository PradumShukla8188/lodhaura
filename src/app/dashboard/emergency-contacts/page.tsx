"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Phone, Plus, Loader2, Trash2, Edit2, Search } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, ColumnDef } from "@/components/ui/data-table";

const CATEGORIES = ['Ambulance', 'Police', 'Fire', 'Hospital', 'Clinic', 'Pharmacy', 'Village Emergency', 'Other'];

export default function EmergencyContactsPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", category: "Other", phone: "", address: "", locationLink: "", description: "", isAvailable24x7: true, status: "active"
  });
  
  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-emergency-contacts", page, limit, search],
    queryFn: async () => {
      const res = await governanceApi.getAdminEmergencyContacts({ page, limit, search });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createEmergencyContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emergency-contacts"] });
      resetForm();
      toast.success("Emergency contact created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create contact");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData & { id: string }) => governanceApi.updateEmergencyContact(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emergency-contacts"] });
      resetForm();
      toast.success("Emergency contact updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update contact");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteEmergencyContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emergency-contacts"] });
      toast.success("Emergency contact deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete contact");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ ...formData, id: editingId });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (contact: any) => {
    setFormData({
      name: contact.name || "",
      category: contact.category || "Other",
      phone: contact.phone || "",
      address: contact.address || "",
      locationLink: contact.locationLink || "",
      description: contact.description || "",
      isAvailable24x7: contact.isAvailable24x7 ?? true,
      status: contact.status || "active",
    });
    setEditingId(contact._id);
    setIsCreating(true);
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: "", category: "Other", phone: "", address: "", locationLink: "", description: "", isAvailable24x7: true, status: "active" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const contacts = response?.data || [];
  const pagination = response?.pagination;

  const columns: ColumnDef<any>[] = [
    {
      header: "Contact Details",
      cell: (contact) => (
        <div>
          <p className="font-medium text-foreground">{contact.name}</p>
          <p className="text-xs text-muted-foreground">{contact.phone}</p>
        </div>
      )
    },
    {
      header: "Category",
      cell: (contact) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {contact.category}
        </span>
      )
    },
    {
      header: "Status",
      cell: (contact) => (
        <div className="flex flex-col gap-1">
          <span className={`inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            contact.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
          }`}>
            {contact.status}
          </span>
          {contact.isAvailable24x7 && <span className="text-[10px] text-muted-foreground">24x7 Available</span>}
        </div>
      )
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (contact) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(contact)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm(`Delete contact ${contact.name}?`)) {
                deleteMutation.mutate(contact._id);
              }
            }}
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
          title="Emergency Contacts" 
          subtitle="Manage village emergency helplines and crucial contacts." 
        />
        <Button onClick={() => setIsCreating(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Add Contact
        </Button>
      </div>

      {isCreating && (
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold">{editingId ? "Edit Contact" : "Create New Contact"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name / Organization *</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Location Link (Google Maps)</Label>
                  <Input value={formData.locationLink} onChange={e => setFormData({...formData, locationLink: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is24x7"
                  checked={formData.isAvailable24x7}
                  onChange={(e) => setFormData({ ...formData, isAvailable24x7: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is24x7">Available 24x7</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Contact"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="glass border-white/20">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Search by name, category or phone..."
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
              data={contacts} 
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
