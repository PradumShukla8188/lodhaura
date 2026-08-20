"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2, Plus, Loader2, Edit, Trash2 } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: "", code: "", description: "" });

  const { data: response, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const res = await governanceApi.getDepartments();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setIsCreating(false);
      setFormData({ name: "", code: "", description: "" });
      toast.success("Department created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create department");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const departments = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Departments" 
          subtitle="Manage government and village administration departments." 
        />
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      {isCreating && (
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department Code</Label>
                  <Input 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value})} 
                    className="bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="bg-background/50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept: any) => (
            <Card key={dept._id} className="glass hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{dept.code || "N/A"}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this department?")) {
                        deleteMutation.mutate(dept._id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm line-clamp-2">{dept.description || "No description provided."}</p>
              </CardContent>
            </Card>
          ))}
          {departments.length === 0 && !isCreating && (
            <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed rounded-xl glass">
              No departments found. Create one to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
