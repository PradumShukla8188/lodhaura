"use client";

import { MapPin } from "lucide-react";
import { villageInfo } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";
import { MapEmbed } from "@/components/MapEmbed";

export function MapSection() {
  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Find Us on the Map" subtitle={`${villageInfo.name}, ${villageInfo.district}, ${villageInfo.state}`} />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 lg:col-span-1">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">{villageInfo.name} Village</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {villageInfo.district} District<br />
                  {villageInfo.state}, {villageInfo.country}<br />
                  PIN: {villageInfo.pincode}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">{villageInfo.geography}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <MapEmbed height="350px" />
          </div>
        </div>
      </div>
    </section>
  );
}
