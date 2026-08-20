"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, CalendarDays, MapPin, Users, IndianRupee, Image as ImageIcon } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    featuredImage: "",
    
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    registrationStartDate: "",
    registrationEndDate: "",
    
    venueName: "",
    address: "",
    village: "",
    mapLocation: "",
    
    organizer: "",
    organizerContact: "",
    
    enableRegistration: false,
    maxParticipants: 0,
    registrationFee: 0,
    allowGuest: false,
    
    enableDonation: false,
    donationGoal: 0,
    donationPurpose: "",
    
    status: "Draft",
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => governanceApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event created successfully");
      router.push("/dashboard/events");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Failed to create event"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData(prev => ({ ...prev, [target.name]: value }));
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 mt-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader title="Create New Event" subtitle="Configure all event details, registration, and donations." />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <Card className="glass border-white/20">
          <CardHeader className="pb-4 border-b border-white/10">
            <CardTitle className="text-lg flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" /> Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Annual Village Fair 2026" />
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="A brief summary for the event card..." />
            </div>
            <div className="space-y-2">
              <Label>Featured Image URL</Label>
              <Input name="featuredImage" value={formData.featuredImage} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="space-y-2">
              <Label>Full Description</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} className="min-h-[150px]" placeholder="Detailed information about the event..." />
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card className="glass border-white/20">
          <CardHeader className="pb-4 border-b border-white/10">
            <CardTitle className="text-lg flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Date *</Label><Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>Start Time</Label><Input type="time" name="startTime" value={formData.startTime} onChange={handleChange} /></div>
            <div className="space-y-2"><Label>End Time</Label><Input type="time" name="endTime" value={formData.endTime} onChange={handleChange} /></div>
          </CardContent>
        </Card>

        {/* Location & Organizer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass border-white/20">
            <CardHeader className="pb-4 border-b border-white/10">
              <CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Location</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2"><Label>Venue Name</Label><Input name="venueName" value={formData.venueName} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Address / Landmark</Label><Input name="address" value={formData.address} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Google Maps Link</Label><Input name="mapLocation" value={formData.mapLocation} onChange={handleChange} /></div>
            </CardContent>
          </Card>
          
          <Card className="glass border-white/20">
            <CardHeader className="pb-4 border-b border-white/10">
              <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Organizer</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2"><Label>Organizer Name</Label><Input name="organizer" value={formData.organizer} onChange={handleChange} /></div>
              <div className="space-y-2"><Label>Contact Number</Label><Input name="organizerContact" value={formData.organizerContact} onChange={handleChange} /></div>
              <div className="space-y-2">
                <Label>Event Status</Label>
                <select name="status" value={formData.status} onChange={handleChange} className="flex h-10 w-full items-center rounded-xl border border-border bg-background px-3 text-sm">
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Published">Published (Public)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participation & Donations */}
        <Card className="glass border-primary/20 bg-primary/5">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 border-r border-white/10 pr-6">
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="enableReg" name="enableRegistration" checked={formData.enableRegistration} onChange={handleChange} className="w-4 h-4 accent-primary" />
                <Label htmlFor="enableReg" className="text-lg font-bold">Enable Registrations</Label>
              </div>
              {formData.enableRegistration && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Reg. Start Date</Label><Input type="date" name="registrationStartDate" value={formData.registrationStartDate} onChange={handleChange} /></div>
                    <div className="space-y-2"><Label>Reg. End Date</Label><Input type="date" name="registrationEndDate" value={formData.registrationEndDate} onChange={handleChange} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Max Participants (0=No limit)</Label><Input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} /></div>
                    <div className="space-y-2"><Label>Registration Fee (₹)</Label><Input type="number" name="registrationFee" value={formData.registrationFee} onChange={handleChange} /></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="allowGuest" name="allowGuest" checked={formData.allowGuest} onChange={handleChange} className="w-4 h-4" />
                    <Label htmlFor="allowGuest">Allow guests (+1s)</Label>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="enableDon" name="enableDonation" checked={formData.enableDonation} onChange={handleChange} className="w-4 h-4 accent-green-500" />
                <Label htmlFor="enableDon" className="text-lg font-bold text-green-500">Enable Donations</Label>
              </div>
              {formData.enableDonation && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-2"><Label>Donation Goal (₹)</Label><Input type="number" name="donationGoal" value={formData.donationGoal} onChange={handleChange} /></div>
                  <div className="space-y-2"><Label>Donation Purpose</Label><Input name="donationPurpose" value={formData.donationPurpose} onChange={handleChange} placeholder="e.g. Funding medical supplies" /></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending} className="gap-2">
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Event
          </Button>
        </div>

      </form>
    </div>
  );
}
