"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield, Plus, Loader2, Trash2 } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MODULES = ["Village Projects", "Government Schemes", "Funds", "Complaints", "Users", "Roles", "Departments"];
const ACTIONS = ["View", "Create", "Edit", "Delete", "Approve", "Export"];

export default function RolesPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", displayValue: "", permissions: [] as {module: string, action: string}[] });

  const { data: response, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await governanceApi.getRoles();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setIsCreating(false);
      setFormData({ name: "", displayValue: "", permissions: [] });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create role");
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
    createMutation.mutate(formData);
  };

  const roles = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Roles & Permissions" 
          subtitle="Manage administrative roles and their access permissions." 
        />
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Create Role
        </Button>
      </div>

      {isCreating && (
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role Key (System Name)</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Gram_Sachiv"
                    required 
                    className="bg-background/50"
                  />
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
                <Label className="text-lg">Permission Matrix</Label>
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
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Role"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role: any) => (
            <Card key={role._id} className="glass hover:shadow-md transition-shadow flex flex-col">
              <CardContent className="p-5 flex-1 flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{role.displayValue}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{role.name}</p>
                  </div>
                  {role.name !== 'Admin' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm(`Delete role ${role.displayValue}?`)) deleteMutation.mutate(role._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.slice(0, 5).map((p: any, i: number) => (
                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                          {p.module}:{p.action}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No permissions</span>
                    )}
                    {role.permissions && role.permissions.length > 5 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
                        +{role.permissions.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
