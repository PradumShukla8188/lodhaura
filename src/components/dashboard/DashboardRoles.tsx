"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield, Plus, Loader2, Trash2, Edit2, Search } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, ColumnDef } from "@/components/ui/data-table";

const MODULES = ["Village Projects", "Government Schemes", "Funds", "Complaints & Issues", "Users", "Roles", "Departments", "Documents", "Audit Logs", "Tasks", "Panchayat Meetings", "Events", "Village Information", "Local Services", "Agriculture Services", "Jobs", "Marketplace", "Emergency Contacts", "Residents", "Website Settings", "Workers"];
const ACTIONS = ["View", "Create", "Edit", "Delete", "Approve", "Export"];

export function DashboardRoles() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", displayValue: "", permissions: [] as {module: string, action: string}[] });
  
  // Pagination & Search state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: response, isLoading } = useQuery({
    queryKey: ["roles", page, limit, search],
    queryFn: async () => {
      const res = await governanceApi.getRoles({ page, limit, search });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      resetForm();
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create role");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData & { id: string }) => governanceApi.updateRole(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      resetForm();
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete role");
    }
  });

  const togglePermission = (mod: string, act: string) => {
    const exists = formData.permissions.find(p => p.module === mod && p.action === act);
    if (exists) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => !(p.module === mod && p.action === act))
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, { module: mod, action: act }]
      });
    }
  };

  const hasPerm = (mod: string, act: string) => {
    return formData.permissions.some(p => p.module === mod && p.action === act);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ ...formData, id: editingId });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (role: any) => {
    setFormData({
      name: role.name,
      displayValue: role.displayValue,
      permissions: role.permissions || [],
    });
    setEditingId(role._id);
    setIsCreating(true);
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: "", displayValue: "", permissions: [] });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const roles = response?.data || [];
  const pagination = response?.pagination;

  const columns: ColumnDef<any>[] = [
    {
      header: "Display Name",
      accessorKey: "displayValue",
      className: "font-medium",
    },
    {
      header: "System Name",
      accessorKey: "name",
      className: "text-muted-foreground font-mono text-xs",
    },
    {
      header: "Permissions",
      cell: (role) => (
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          {role.permissions && role.permissions.length > 0 ? (
            role.permissions.slice(0, 3).map((p: any, i: number) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                {p.module}:{p.action}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">None</span>
          )}
          {role.permissions && role.permissions.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
              +{role.permissions.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (role) => (
        <div className="flex justify-end gap-2">
          {role.name !== "super_admin" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(role)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {!["super_admin", "admin", "user"].includes(role.name) && (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm(`Delete role ${role.displayValue}?`)) {
                  deleteMutation.mutate(role._id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Role Management" 
          subtitle="Manage administrative roles and their granular access permissions." 
        />
        <Button onClick={() => setIsCreating(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Create Role
        </Button>
      </div>

      {isCreating && (
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold">{editingId ? "Edit Role" : "Create New Role"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role Key (System Name)</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. gram_sachiv"
                    required 
                    disabled={editingId !== null && ["super_admin", "admin", "user"].includes(formData.name)}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">Unique identifier used in backend code. No spaces.</p>
                </div>
                <div className="space-y-2">
                  <Label>Display Value</Label>
                  <Input 
                    value={formData.displayValue} 
                    onChange={e => setFormData({...formData, displayValue: e.target.value})} 
                    placeholder="e.g. Gram Sachiv"
                    required 
                    className="bg-background/50"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-lg">Permission Matrix</Label>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/10 bg-background/30">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-primary/10 text-primary uppercase">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Module</th>
                        {ACTIONS.map(act => <th key={act} className="px-4 py-3 font-semibold text-center">{act}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {MODULES.map(mod => (
                        <tr key={mod} className="hover:bg-primary/5 transition-colors">
                          <td className="px-4 py-3 font-medium">{mod}</td>
                          {ACTIONS.map(act => (
                            <td key={`${mod}-${act}`} className="px-4 py-3 text-center">
                              <input 
                                type="checkbox" 
                                checked={hasPerm(mod, act)}
                                onChange={() => togglePermission(mod, act)}
                                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Role"}
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
                placeholder="Search roles..."
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
              data={roles} 
              isLoading={isLoading} 
              pagination={pagination ? {
                ...pagination,
                onPageChange: setPage,
                onLimitChange: (l) => { setLimit(l); setPage(1); }
              } : undefined}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
