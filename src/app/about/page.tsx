import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { MapEmbed } from "@/components/MapEmbed";
import { villageInfo, villageStats, timeline, villageLeaders } from "@/lib/village-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "About Lodhaura",
  description: "History, geography, culture and leadership of Lodhaura village.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Lodhaura"
        subtitle={villageInfo.description}
        badge="Our Heritage"
      />

      <section id="history" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="History" subtitle="Roots that run deep" />
          <div className="glass rounded-2xl p-6 sm:p-8">
            <p className="leading-relaxed text-muted-foreground">{villageInfo.history}</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Geography" subtitle="Land of fertile plains" />
          <p className="max-w-3xl text-muted-foreground">{villageInfo.geography}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Area", value: villageInfo.area },
              { label: "District", value: villageInfo.district },
              { label: "State", value: villageInfo.state },
              { label: "PIN Code", value: villageInfo.pincode },
            ].map((item) => (
              <Card key={item.label} className="glass border-white/20">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Culture & Traditions" />
          <p className="max-w-3xl text-muted-foreground">{villageInfo.culture}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {villageInfo.highlights.map((h) => (
              <Badge key={h} variant="secondary">{h}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Timeline" subtitle="Milestones through the years" />
          <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-primary/20 sm:before:left-1/2">
            {timeline.map((item, i) => (
              <div key={item.year} className={`relative flex flex-col sm:flex-row ${i % 2 === 0 ? "sm:flex-row-reverse" : ""} sm:items-center`}>
                <div className="hidden sm:block sm:w-1/2" />
                <div className="absolute left-4 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-white sm:left-1/2">
                  {item.year.slice(2)}
                </div>
                <Card className={`glass ml-12 border-white/20 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                  <CardContent className="p-5">
                    <Badge variant="accent" className="mb-2">{item.year}</Badge>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Village Leaders" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {villageLeaders.map((leader) => (
              <Card key={leader.name} className="glass border-white/20 text-center">
                <CardContent className="p-6">
                  <Avatar
                    size="lg"
                    fallback={leader.name.split(" ").slice(-1)[0]?.[0]}
                    className="mx-auto bg-gradient-village text-white border-0"
                  />
                  <h3 className="mt-4 font-semibold">{leader.name}</h3>
                  <p className="text-sm text-primary">{leader.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{leader.tenure}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Village Statistics" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {villageStats.map((stat) => (
              <Card key={stat.label} className="glass border-white/20 text-center">
                <CardContent className="p-4">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Location Map" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {villageInfo.coordinates.lat}, {villageInfo.coordinates.lng}
          </div>
          <div className="mt-6">
            <MapEmbed height="450px" />
          </div>
        </div>
      </section>
    </>
  );
}
