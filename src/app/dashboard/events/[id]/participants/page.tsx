"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ArrowLeft, UserCheck, XCircle, CheckCircle2 } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EventParticipantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: eventRes, isLoading: eventLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => (await governanceApi.getEventById(id as string)).data,
  });

  const { data: participantsRes, isLoading: participantsLoading } = useQuery({
    queryKey: ["event-participants", id],
    queryFn: async () => (await governanceApi.getEventParticipants(id as string)).data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ regId, data }: { regId: string, data: any }) => governanceApi.updateParticipantStatus(id as string, regId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-participants", id] });
      toast.success("Participant updated");
    },
    onError: () => toast.error("Failed to update participant")
  });

  const event = eventRes?.data;
  const participants = participantsRes?.data || [];
  const isLoading = eventLoading || participantsLoading;

  if (isLoading) return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 mt-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/events")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader title="Participant Management" subtitle={`Manage registrations for ${event?.title}`} />
      </div>

      <Card className="glass border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/20 text-muted-foreground border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Ref ID / Date</th>
                <th className="px-6 py-4">Participant info</th>
                <th className="px-6 py-4 text-center">Seats</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((reg: any) => (
                <tr key={reg._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-primary font-medium">{reg.referenceId}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(reg.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{reg.name}</div>
                    <div className="text-xs text-muted-foreground">{reg.mobile} • {reg.email}</div>
                    {reg.note && <div className="text-xs text-orange-400 mt-1 italic max-w-[200px] truncate">"{reg.note}"</div>}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-lg">{reg.attendees}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={reg.status} 
                      onChange={(e) => updateMutation.mutate({ regId: reg._id, data: { status: e.target.value }})}
                      className="bg-background border border-white/10 rounded px-2 py-1 text-xs outline-none focus:ring-1 ring-primary"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={reg.attendance} 
                      onChange={(e) => updateMutation.mutate({ regId: reg._id, data: { attendance: e.target.value }})}
                      className={`bg-background border border-white/10 rounded px-2 py-1 text-xs outline-none ${reg.attendance === 'Checked In' ? 'text-blue-400' : reg.attendance === 'Attended' ? 'text-green-500 font-bold' : ''}`}
                    >
                      <option value="Registered">Registered</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Attended">Attended</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {reg.attendance !== 'Checked In' && reg.attendance !== 'Attended' && (
                      <Button size="sm" variant="outline" className="h-7 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10" 
                        onClick={() => updateMutation.mutate({ regId: reg._id, data: { attendance: 'Checked In' }})}>
                        Check In
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground italic">No participants registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
