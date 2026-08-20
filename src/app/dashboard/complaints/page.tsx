"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MessageSquare, Phone, AlertCircle, Edit, CheckCircle2 } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ComplaintsPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState({ status: "", assignedTo: "", resolutionRemarks: "" });

  const { data: response, isLoading } = useQuery({
    queryKey: ["complaints"],
    queryFn: async () => (await governanceApi.getComplaints()).data,
  });

  const { data: usersRes } = useQuery({
    queryKey: ["govUsers"],
    queryFn: async () => (await governanceApi.getGovUsers()).data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => governanceApi.updateComplaint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      setEditingId(null);
      toast.success("Complaint updated successfully");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to update complaint"),
  });

  const handleUpdate = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    updateMutation.mutate({ id, data: updateData });
  };

  const startEditing = (complaint: any) => {
    setEditingId(complaint._id);
    setUpdateData({
      status: complaint.status,
      assignedTo: complaint.assignedTo?._id || "",
      resolutionRemarks: complaint.resolutionRemarks || ""
    });
  };

  const complaints = response?.data || [];
  const govUsers = usersRes?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <PageHeader 
        title="Public Grievances & Complaints" 
        subtitle="Manage issues reported by citizens and track their resolution status." 
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint: any) => (
            <Card key={complaint._id} className={`glass transition-shadow border ${
              complaint.status === 'Resolved' ? 'border-green-500/30' : 
              complaint.status === 'Submitted' ? 'border-red-500/30' : 
              'border-white/20'
            }`}>
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <Badge variant="outline" className={
                    complaint.status === 'Resolved' || complaint.status === 'Closed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                    complaint.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                    complaint.status === 'Submitted' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }>
                    {complaint.status}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>

                <div>
                  <h3 className="font-semibold text-lg line-clamp-2">{complaint.subject}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{complaint.description}</p>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground bg-background/50 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-2"><MessageSquare className="h-3 w-3"/> {complaint.name}</div>
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3"/> {complaint.phone}</div>
                  <div className="flex items-center gap-2"><AlertCircle className="h-3 w-3"/> {complaint.category}</div>
                </div>

                {editingId === complaint._id ? (
                  <form onSubmit={(e) => handleUpdate(e, complaint._id)} className="space-y-3 pt-3 border-t border-white/10">
                    <div className="space-y-1">
                      <Label className="text-xs">Update Status</Label>
                      <select 
                        className="flex h-8 w-full items-center rounded-md border border-border bg-background px-3 text-xs"
                        value={updateData.status} onChange={e => setUpdateData({...updateData, status: e.target.value})}
                      >
                        <option value="Submitted">Submitted (New)</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Assign To Officer</Label>
                      <select 
                        className="flex h-8 w-full items-center rounded-md border border-border bg-background px-3 text-xs"
                        value={updateData.assignedTo} onChange={e => setUpdateData({...updateData, assignedTo: e.target.value})}
                      >
                        <option value="">Unassigned</option>
                        {govUsers.map((u: any) => <option key={u._id} value={u._id}>{u.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Resolution Remarks</Label>
                      <Textarea 
                        className="min-h-[60px] text-xs"
                        value={updateData.resolutionRemarks} 
                        onChange={e => setUpdateData({...updateData, resolutionRemarks: e.target.value})} 
                        placeholder="Action taken to resolve..." 
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="sm" className="w-full h-8 text-xs" onClick={() => setEditingId(null)}>Cancel</Button>
                      <Button type="submit" size="sm" className="w-full h-8 text-xs" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="pt-2">
                    {complaint.assignedTo ? (
                      <p className="text-xs font-medium text-primary mb-3">Assigned to: {complaint.assignedTo.name}</p>
                    ) : (
                      <p className="text-xs text-orange-500 mb-3 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Requires assignment</p>
                    )}
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1" onClick={() => startEditing(complaint)}>
                      <Edit className="h-3 w-3" /> Update Grievance
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {complaints.length === 0 && (
            <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed rounded-xl glass">
              No active complaints or grievances.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
