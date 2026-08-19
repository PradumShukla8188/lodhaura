import type { Metadata } from "next";
import { Calendar, FileText, Phone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { panchayatMembers, panchayatMeetings, panchayatNotices } from "@/lib/village-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Gram Panchayat",
  description: "Panchayat members, meetings and official notices for Lodhaura.",
};

export default function PanchayatPage() {
  return (
    <>
      <PageHeader
        title="Gram Panchayat"
        subtitle="Elected representatives, meeting schedules and official notices"
        badge="Local Governance"
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Panchayat Members" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {panchayatMembers.map((member) => (
              <Card key={member.name} className="glass border-white/20">
                <CardContent className="flex items-center gap-4 p-5">
                  <Avatar
                    fallback={member.name.split(" ").slice(-1)[0]?.[0]}
                    className="bg-gradient-village text-white border-0"
                  />
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.ward}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Meetings" />
          <div className="space-y-4">
            {panchayatMeetings.map((meeting) => (
              <Card key={meeting.date + meeting.agenda} className="glass border-white/20">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{meeting.agenda}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(meeting.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={meeting.status === "upcoming" ? "accent" : "secondary"} className="capitalize">
                    {meeting.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Official Notices" />
          <div className="space-y-3">
            {panchayatNotices.map((notice) => (
              <Card key={notice.id} className="glass border-white/20">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{notice.title}</p>
                      <p className="text-xs text-muted-foreground">{notice.date}</p>
                    </div>
                  </div>
                  {notice.urgent && <Badge variant="accent">Urgent</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
