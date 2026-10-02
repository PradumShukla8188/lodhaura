"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { residentApi } from "@/lib/api-services";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Users, UserPlus } from "lucide-react";

export function DashboardFamily() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: "", relationship: "", occupation: "" });
  
  const { data: resData, isLoading } = useQuery({
    queryKey: ["resident-family"],
    queryFn: async () => (await residentApi.getFamilyMembers()).data,
  });

  const addMember = useMutation({
    mutationFn: residentApi.addFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resident-family"] });
      toast.success("Family member added!");
      setShowAdd(false);
      setFormData({ name: "", relationship: "", occupation: "" });
    },
    onError: () => toast.error("Failed to add family member"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.relationship) return toast.error("Name and relationship required");
    addMember.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const members = resData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2"><Users className="h-5 w-5" /> Household Members</h3>
        <Button onClick={() => setShowAdd(!showAdd)} variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" /> Add Member
        </Button>
      </div>

      {showAdd && (
        <Card className="glass border-primary/30">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Member's name" />
                </div>
                <div className="space-y-2">
                  <Label>Relationship *</Label>
                  <Input value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} placeholder="e.g. Son, Wife" />
                </div>
                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="Occupation" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button type="submit" disabled={addMember.isPending}>
                  {addMember.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Member"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((member: any) => (
          <Card key={member._id} className="glass">
            <CardContent className="p-4">
              <h4 className="font-bold text-lg">{member.name}</h4>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p><span className="font-medium text-foreground">Relationship:</span> {member.relationship}</p>
                {member.occupation && <p><span className="font-medium text-foreground">Occupation:</span> {member.occupation}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
        {members.length === 0 && !showAdd && (
          <div className="col-span-full text-center p-8 border border-dashed border-white/20 rounded-xl">
            <p className="text-muted-foreground">No family members added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
