"use client";

import { getUpcomingEvents } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";
import { EventCard } from "@/components/EventCard";

export function UpcomingEventsSection() {
  const upcoming = getUpcomingEvents().slice(0, 3);

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Upcoming Events" subtitle="Mark your calendar" href="/events" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} showCountdown />
          ))}
        </div>
      </div>
    </section>
  );
}
