import type { Metadata } from "next";
import { QrCode, Heart, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { donationCampaign, topDonors } from "@/lib/village-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DonateActions } from "./DonateActions";
import { DonationPaymentSection } from "./DonationPaymentSection";

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Lodhaura community projects through donations.",
};

export default function DonationPage() {
  const percent = Math.round((donationCampaign.raised / donationCampaign.goal) * 100);

  return (
    <>
      <PageHeader
        title="Support Our Village"
        subtitle={donationCampaign.description}
        badge="Community Fund"
      />

      <section className="py-10 sm:py-16">
        <div className="page-container">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <Card className="glass border-white/20">
              <CardContent className="p-5 sm:p-8">
                <h2 className="text-lg font-bold sm:text-xl">{donationCampaign.title}</h2>
                <div className="mt-6">
                  <Progress value={percent} showLabel />
                </div>
                <div className="mt-4 flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
                  <span>Raised: <strong className="text-primary">₹{donationCampaign.raised.toLocaleString("en-IN")}</strong></span>
                  <span>Goal: <strong>₹{donationCampaign.goal.toLocaleString("en-IN")}</strong></span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  {donationCampaign.donors} donors contributed
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-5 sm:p-8">
                <h2 className="mb-4 text-lg font-bold sm:text-xl">Donate Online</h2>
                <DonationPaymentSection />
              </CardContent>
            </Card>
          </div>

          <Card className="glass mt-6 border-white/20 lg:mt-8">
            <CardContent className="p-5 text-center sm:p-8">
              <QrCode className="mx-auto h-12 w-12 text-primary sm:h-16 sm:w-16" />
              <p className="mt-4 text-sm text-muted-foreground">Or scan to pay via UPI</p>
              <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-muted/30 sm:h-48 sm:w-48">
                <span className="px-4 text-xs text-muted-foreground">UPI QR Placeholder</span>
              </div>
              <div className="mx-auto mt-6 max-w-xs rounded-xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">UPI ID</p>
                <p className="mt-1 break-all font-mono text-sm font-semibold text-primary sm:text-base">
                  {donationCampaign.upiId}
                </p>
              </div>
              <DonateActions upiId={donationCampaign.upiId} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/30 py-10 sm:py-16">
        <div className="page-container">
          <SectionTitle title="Top Donors" subtitle="Thank you for your generosity" />
          <div className="grid gap-4 sm:grid-cols-2">
            {topDonors.map((donor, i) => (
              <Card key={donor.name} className="glass border-white/20">
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-village text-sm font-bold text-white">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-xs text-muted-foreground">{donor.date}</p>
                    </div>
                  </div>
                  <Badge variant="accent" className="w-fit gap-1">
                    <Heart className="h-3 w-3" />
                    ₹{donor.amount.toLocaleString("en-IN")}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
