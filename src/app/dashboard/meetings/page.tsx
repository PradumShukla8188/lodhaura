"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Users, Calendar, MapPin, CheckCircle, Clock } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MeetingsPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", date: "", location: "", agenda: "" });

  const { data: response, isLoading } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => (await governanceApi.getMeetings()).data,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => governanceApi.createMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setIsCreating(false);
      setFormData({ title: "", date: "", location: "", agenda: "" });
      toast.success("Meeting recorded successfully");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to record meeting"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const meetings = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Panchayat Meetings" 
          subtitle="Official records of village committee meetings, decisions, and action items." 
        />
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Record Meeting
        </Button>
      </div>

      {isCreating && (
        <Card className="glass border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meeting Title *</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g. Gram Sabha Monthly Meeting" />
                </div>
                <div className="space-y-2">
                  <Label>Date & Time *</Label>
                  <Input type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Panchayat Bhavan" />
              </div>
              <div className="space-y-2">
                <Label>Agenda *</Label>
                <Textarea value={formData.agenda} onChange={e => setFormData({...formData, agenda: e.target.value})} required placeholder="What was discussed?" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Record"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="relative border-l border-white/10 ml-4 space-y-8 py-4">
          {meetings.map((meeting: any) => (
            <div key={meeting._id} className="relative pl-8">
              <div className="absolute w-4 h-4 bg-primary/20 border-2 border-primary rounded-full -left-2 top-1 ring-4 ring-background" />
              <Card className="glass border-white/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold">{meeting.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {new Date(meeting.date).toLocaleString()}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/> {meeting.location || "Not specified"}</span>
                        <span className="flex items-center gap-1.5"><Users className="h-4 w-4"/> {meeting.participants?.length || 0} Attendees</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Agenda / Topics Discussed</h4>
                    <p className="text-sm bg-background/50 p-4 rounded-lg border border-white/5 whitespace-pre-wrap">{meeting.agenda}</p>
                  </div>

                  {meeting.actionItems?.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Action Items</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {meeting.actionItems.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-background/30 rounded-lg border border-white/5">
                            {item.status === 'Completed' ? <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" /> : <Clock className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />}
                            <div className="text-sm">
                              <p className="font-medium">{item.task}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Assigned to: {item.responsiblePerson?.name || "Unassigned"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
          {meetings.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">No meetings recorded yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
