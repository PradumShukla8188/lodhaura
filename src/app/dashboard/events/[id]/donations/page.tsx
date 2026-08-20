"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Heart, IndianRupee } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EventDonationsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: eventRes, isLoading: eventLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => (await governanceApi.getEventById(id as string)).data,
  });

  const { data: donationsRes, isLoading: donationsLoading } = useQuery({
    queryKey: ["event-donations", id],
    queryFn: async () => (await governanceApi.getEventDonations(id as string)).data,
  });

  const event = eventRes?.data;
  const donations = donationsRes?.data || [];
  const isLoading = eventLoading || donationsLoading;

  if (isLoading) return <div className="flex h-[50vh] justify-center items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 mt-16">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/events")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader title="Donation Ledger" subtitle={`Financial records for ${event?.title}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Raised</p>
              <h3 className="text-3xl font-bold text-green-500 mt-2">₹{event?.totalDonations?.toLocaleString() || 0}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Donors</p>
              <h3 className="text-3xl font-bold text-blue-500 mt-2">{donations.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-white/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Donation Goal</p>
              <h3 className="text-3xl font-bold mt-2">₹{event?.donationGoal?.toLocaleString() || 0}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-black/20 text-muted-foreground border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Transaction / Date</th>
                <th className="px-6 py-4">Donor Info</th>
                <th className="px-6 py-4">Message</th>
                <th className="px-6 py-4 text-right">Amount (₹)</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((don: any) => (
                <tr key={don._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-primary font-medium">{don.transactionId}</div>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(don.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{don.isAnonymous ? <span className="italic text-muted-foreground">Anonymous Donor</span> : don.donorName}</div>
                    {!don.isAnonymous && <div className="text-xs text-muted-foreground">{don.mobile} • {don.email}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {don.message ? <div className="text-xs italic max-w-[300px]">"{don.message}"</div> : <span className="text-muted-foreground">-</span>}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-lg text-green-500">
                    {don.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">{don.status}</span>
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">No donations received yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
