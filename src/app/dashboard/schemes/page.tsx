"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Landmark, Plus, Loader2, Trash2 } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SchemesPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", description: "", level: "State", status: "active", officialWebsite: "", applicableVillage: "" 
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ["schemes"],
    queryFn: async () => {
      const res = await governanceApi.getSchemes();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createScheme(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
      setIsCreating(false);
      setFormData({ title: "", description: "", level: "State", status: "active", officialWebsite: "", applicableVillage: "" });
      toast.success("Scheme created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create scheme");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteScheme(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schemes"] });
      toast.success("Scheme deleted successfully");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const schemes = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Government Schemes" 
          subtitle="Manage verified central, state, and local schemes." 
        />
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Scheme
        </Button>
      </div>

      {isCreating && (
        <Card className="glass border-white/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scheme Title *</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Government Level</Label>
                  <select 
                    className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm"
                    value={formData.level}
                    onChange={e => setFormData({...formData, level: e.target.value})}
                  >
                    <option value="Central">Central Govt</option>
                    <option value="State">State Govt</option>
                    <option value="Local">Local/Panchayat</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Official Website</Label>
                  <Input value={formData.officialWebsite} onChange={e => setFormData({...formData, officialWebsite: e.target.value})} placeholder="https://" />
                </div>
                <div className="space-y-2">
                  <Label>Applicable Village</Label>
                  <Input value={formData.applicableVillage} onChange={e => setFormData({...formData, applicableVillage: e.target.value})} placeholder="e.g. Lodhaura" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Scheme"}
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
          {schemes.map((scheme: any) => (
            <Card key={scheme._id} className="glass hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{scheme.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                        {scheme.level || "State"}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {scheme.status}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10 shrink-0 ml-2"
                    onClick={() => { if (confirm("Delete scheme?")) deleteMutation.mutate(scheme._id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm line-clamp-3 text-muted-foreground">{scheme.description}</p>
                {scheme.officialWebsite && (
                  <a href={scheme.officialWebsite} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline block truncate">
                    {scheme.officialWebsite}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
