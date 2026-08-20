"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Plus, Loader2, Trash2 } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GovUsersPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", password: "", roleId: "", department: "", designation: "", employeeId: "" 
  });

  const { data: usersRes, isLoading: loadingUsers } = useQuery({
    queryKey: ["gov-users"],
    queryFn: async () => {
      const res = await governanceApi.getGovUsers();
      return res.data;
    },
  });

  const { data: rolesRes } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await governanceApi.getRoles();
      return res.data;
    },
  });

  const { data: deptRes } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await governanceApi.getDepartments();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createGovUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gov-users"] });
      setIsCreating(false);
      setFormData({ name: "", email: "", phone: "", password: "", roleId: "", department: "", designation: "", employeeId: "" });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteGovUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gov-users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const users = usersRes?.data || [];
  const roles = rolesRes?.data || [];
  const departments = deptRes?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Government & Staff Users" 
          subtitle="Manage officials, staff members, and their assigned roles." 
        />
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {isCreating && (
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Temporary Password *</Label>
                  <Input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <Label>Primary Role *</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.roleId}
                    onChange={e => setFormData({...formData, roleId: e.target.value})}
                    required
                  >
                    <option value="">Select a role...</option>
                    {roles.map((r: any) => (
                      <option key={r._id} value={r._id}>{r.displayValue}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="">Select a department...</option>
                    {departments.map((d: any) => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="e.g. Senior Officer" />
                </div>
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} placeholder="e.g. EMP-12345" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loadingUsers ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-background/30 glass">
          <table className="w-full text-sm text-left">
            <thead className="bg-primary/10 text-primary">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Primary Role</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user.roleId?.displayValue || "None"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.department?.name || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.designation || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if(confirm("Delete this user?")) deleteMutation.mutate(user._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
