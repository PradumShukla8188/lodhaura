import type { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { schoolInfo } from "@/lib/village-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Lodhaura Primary School",
  description: "Education, facilities and achievements at Lodhaura Primary School.",
};

export default function SchoolPage() {
  return (
    <>
      <PageHeader
        title={schoolInfo.name}
        subtitle={schoolInfo.description}
        badge="Education Hub"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image src={schoolInfo.image} alt={schoolInfo.name} fill className="object-cover" sizes="600px" />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Students", value: schoolInfo.students, icon: Users },
                  { label: "Teachers", value: schoolInfo.teachers, icon: GraduationCap },
                  { label: "Since", value: "1975", icon: Trophy },
                ].map((item) => (
                  <Card key={item.label} className="glass border-white/20 text-center">
                    <CardContent className="p-4">
                      <item.icon className="mx-auto h-5 w-5 text-primary" />
                      <p className="mt-2 text-xl font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Principal: <strong className="text-foreground">{schoolInfo.principal}</strong></p>
              <div>
                <h3 className="font-semibold">Facilities</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {schoolInfo.facilities.map((f) => (
                    <Badge key={f} variant="secondary">{f}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Achievements</h3>
                <ul className="mt-2 space-y-1">
                  {schoolInfo.achievements.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
