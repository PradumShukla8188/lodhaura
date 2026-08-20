"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Calendar, MapPin, Users, Heart, ArrowLeft, Clock, IndianRupee } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/store/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isRegOpen, setIsRegOpen] = useState(false);
  const [isDonOpen, setIsDonOpen] = useState(false);

  const [regData, setRegData] = useState({ name: user?.name || "", mobile: user?.phone || "", email: user?.email || "", attendees: 1, note: "" });
  const [donData, setDonData] = useState({ donorName: user?.name || "", mobile: user?.phone || "", email: user?.email || "", amount: 100, isAnonymous: false, message: "" });

  const { data: response, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => (await governanceApi.getEventById(id as string)).data,
  });

  const regMutation = useMutation({
    mutationFn: (data: any) => governanceApi.registerForEvent(id as string, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      setIsRegOpen(false);
      toast.success(`Successfully registered! Ref: ${res.data.data.referenceId}`);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Registration failed")
  });

  const donMutation = useMutation({
    mutationFn: (data: any) => governanceApi.donateToEvent(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      setIsDonOpen(false);
      toast.success(`Thank you for your generous donation!`);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Donation failed")
  });

  const event = response?.data;

  if (isLoading) return <div className="flex h-screen justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!event) return <div className="p-12 text-center">Event not found.</div>;

  const progress = event.donationGoal ? Math.min(100, Math.round((event.totalDonations / event.donationGoal) * 100)) : 0;
  const isOngoing = event.status === 'Ongoing' || event.status === 'Registration Open';

  return (
    <div className="min-h-screen pb-12 mt-16">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full bg-black/90 flex items-end">
        {event.featuredImage && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
            <img src={event.featuredImage} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          </>
        )}
        <div className="container relative z-20 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
          <Button variant="outline" size="sm" className="mb-4 bg-black/50 border-white/20 text-white hover:bg-black/70" onClick={() => router.push("/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
          </Button>
          <div className="flex gap-2 mb-2">
            <Badge className="bg-primary">{event.status}</Badge>
            {event.category && <Badge variant="outline" className="border-white/30 text-white/90">{event.category.name}</Badge>}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-white/80 pt-4">
            <span className="flex items-center gap-2 text-lg"><Calendar className="h-5 w-5"/> {new Date(event.startDate).toLocaleDateString()}</span>
            <span className="flex items-center gap-2 text-lg"><Clock className="h-5 w-5"/> {event.startTime || 'TBA'}</span>
            <span className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5"/> {event.venueName || event.location || 'Location TBA'}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">About Event</h2>
              <div className="whitespace-pre-wrap leading-relaxed opacity-90">{event.description}</div>
            </div>

            {event.galleryImages && event.galleryImages.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.galleryImages.map((img: string, i: number) => (
                    <img key={i} src={img} alt={`Gallery ${i}`} className="w-full h-40 object-cover rounded-xl border border-white/10" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Participation Box */}
            {event.enableRegistration && (
              <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                <h3 className="text-xl font-bold flex items-center gap-2"><Users className="h-5 w-5 text-blue-500" /> Participation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Registered</span>
                    <span>{event.totalParticipants} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''}</span>
                  </div>
                  {event.maxParticipants > 0 && (
                    <div className="w-full bg-background rounded-full h-2 border border-white/10 overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (event.totalParticipants / event.maxParticipants) * 100)}%` }} />
                    </div>
                  )}
                </div>
                {isOngoing ? (
                  <Button className="w-full h-12 text-lg shadow-lg bg-blue-500 hover:bg-blue-600 text-white" 
                          onClick={() => isAuthenticated ? setIsRegOpen(true) : toast.info("Please login to register.")}>
                    Join Event
                  </Button>
                ) : (
                  <Button disabled className="w-full h-12">Registration Closed</Button>
                )}
                {event.registrationFee > 0 && <p className="text-center text-xs text-muted-foreground mt-2">Registration Fee: ₹{event.registrationFee}</p>}
              </div>
            )}

            {/* Donation Box */}
            {event.enableDonation && (
              <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
                <h3 className="text-xl font-bold flex items-center gap-2"><Heart className="h-5 w-5 text-green-500 fill-green-500/20" /> Support Event</h3>
                {event.donationPurpose && <p className="text-sm opacity-80 leading-relaxed italic">"{event.donationPurpose}"</p>}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-green-500">₹{event.totalDonations.toLocaleString()} Raised</span>
                    {event.donationGoal > 0 && <span className="opacity-70">Goal: ₹{event.donationGoal.toLocaleString()}</span>}
                  </div>
                  {event.donationGoal > 0 && (
                    <div className="w-full bg-background rounded-full h-3 border border-white/10 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
                <Button className="w-full h-12 text-lg shadow-lg bg-green-500 hover:bg-green-600 text-white gap-2"
                        onClick={() => isAuthenticated ? setIsDonOpen(true) : toast.info("Please login to donate.")}>
                  <IndianRupee className="h-4 w-4" /> Donate Now
                </Button>
              </div>
            )}

            {/* Event Info */}
            <div className="glass rounded-2xl p-6 border border-white/20 space-y-4">
              <h3 className="font-bold border-b border-white/10 pb-2">Event Information</h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground block text-xs">Organizer</span><span className="font-medium">{event.organizer || 'Village Committee'}</span></div>
                {event.organizerContact && <div><span className="text-muted-foreground block text-xs">Contact</span><span>{event.organizerContact}</span></div>}
                <div><span className="text-muted-foreground block text-xs">Address</span><span>{event.address || event.village || 'Not specified'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Dialog open={isRegOpen} onOpenChange={setIsRegOpen}>
        <DialogContent className="sm:max-w-[425px] glass border-white/20">
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>Confirm your details to join {event.title}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); regMutation.mutate(regData); }} className="space-y-4 py-4">
            <div className="space-y-2"><Label>Full Name *</Label><Input value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} required /></div>
            <div className="space-y-2"><Label>Mobile Number *</Label><Input value={regData.mobile} onChange={e => setRegData({...regData, mobile: e.target.value})} required /></div>
            {event.allowGuest && (
              <div className="space-y-2"><Label>Number of Attendees</Label><Input type="number" min={1} max={10} value={regData.attendees} onChange={e => setRegData({...regData, attendees: parseInt(e.target.value)})} /></div>
            )}
            <div className="space-y-2"><Label>Optional Note</Label><Textarea value={regData.note} onChange={e => setRegData({...regData, note: e.target.value})} /></div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={regMutation.isPending}>
              {regMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Registration"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Donation Modal */}
      <Dialog open={isDonOpen} onOpenChange={setIsDonOpen}>
        <DialogContent className="sm:max-w-[425px] glass border-white/20">
          <DialogHeader>
            <DialogTitle>Support {event.title}</DialogTitle>
            <DialogDescription>Your contribution helps make this event successful.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); donMutation.mutate(donData); }} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Amount (₹) *</Label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[100, 500, 1000, 2500, 5000].map(amt => (
                  <Button key={amt} type="button" variant={donData.amount === amt ? 'default' : 'outline'} className={donData.amount === amt ? 'bg-green-500 hover:bg-green-600 text-white' : ''} onClick={() => setDonData({...donData, amount: amt})}>
                    ₹{amt}
                  </Button>
                ))}
              </div>
              <Input type="number" min={1} value={donData.amount} onChange={e => setDonData({...donData, amount: parseInt(e.target.value)})} required />
            </div>
            <div className="space-y-2"><Label>Your Name</Label><Input value={donData.donorName} onChange={e => setDonData({...donData, donorName: e.target.value})} disabled={donData.isAnonymous} required={!donData.isAnonymous} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="anon" checked={donData.isAnonymous} onChange={e => setDonData({...donData, isAnonymous: e.target.checked, donorName: e.target.checked ? 'Anonymous' : (user?.name || '')})} className="w-4 h-4" />
              <Label htmlFor="anon">Donate Anonymously</Label>
            </div>
            <div className="space-y-2"><Label>Message of Support</Label><Textarea value={donData.message} onChange={e => setDonData({...donData, message: e.target.value})} placeholder="Keep up the good work!" /></div>
            <Button type="submit" className="w-full h-12 text-lg bg-green-500 hover:bg-green-600 text-white shadow-lg gap-2" disabled={donMutation.isPending}>
              {donMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><IndianRupee className="h-4 w-4" /> Proceed to Secure Payment</>}
            </Button>
            <p className="text-center text-xs text-muted-foreground opacity-70">Payment gateway is in test mode. No real charges will occur.</p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
