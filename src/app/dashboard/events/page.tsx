"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Calendar, MapPin, Users, IndianRupee, Edit, Trash2, Eye } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EventsAdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => (await governanceApi.getEvents(true)).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => governanceApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted successfully");
    }
  });

  const events = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader 
          title="Event Management" 
          subtitle="Create, manage, and track village events and activities." 
        />
        <Button onClick={() => router.push("/dashboard/events/create")} className="gap-2">
          <Plus className="h-4 w-4" /> Create New Event
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <Card key={event._id} className="glass border-white/20 hover:shadow-lg transition-all overflow-hidden flex flex-col">
              {event.featuredImage ? (
                <div className="h-48 w-full relative overflow-hidden bg-muted">
                  <img src={event.featuredImage} alt={event.title} className="object-cover w-full h-full" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge className={
                      event.status === 'Published' ? 'bg-green-500' : 
                      event.status === 'Draft' ? 'bg-gray-500' : 
                      event.status === 'Ongoing' ? 'bg-blue-500' : 
                      event.status === 'Registration Open' ? 'bg-purple-500' : 'bg-primary'
                    }>{event.status}</Badge>
                  </div>
                </div>
              ) : (
                <div className="h-24 w-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center border-b border-white/10 relative">
                  <Calendar className="h-8 w-8 text-primary/50" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Badge variant="secondary">{event.status}</Badge>
                  </div>
                </div>
              )}
              
              <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" /> {event.venueName || event.location || 'Location TBA'}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border border-white/5 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> Date</span>
                    <span className="font-medium text-foreground">{new Date(event.startDate).toLocaleDateString()}</span>
                  </div>
                  {event.enableRegistration && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><Users className="h-4 w-4"/> Participants</span>
                      <span className="font-medium text-foreground">{event.totalParticipants || 0} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''}</span>
                    </div>
                  )}
                  {event.enableDonation && (
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4"/> Donations</span>
                      <span className="font-medium text-green-500">₹{event.totalDonations || 0}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Button variant="outline" size="sm" className="flex-1 h-8 px-2" onClick={() => router.push(`/dashboard/events/${event._id}/edit`)}>
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  {event.enableRegistration && (
                    <Button variant="outline" size="sm" className="flex-1 h-8 px-2 text-blue-500" onClick={() => router.push(`/dashboard/events/${event._id}/participants`)}>
                      <Users className="h-3.5 w-3.5 mr-1" /> Reg
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="flex-1 h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-500/10" 
                    onClick={() => { if(confirm('Cancel or Delete this event?')) deleteMutation.mutate(event._id) }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {events.length === 0 && (
            <div className="col-span-full p-12 text-center text-muted-foreground border border-dashed rounded-xl glass">
              No events created yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
