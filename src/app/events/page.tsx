import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { EventCard } from "@/components/EventCard";
import { getUpcomingEvents, getPastEvents } from "@/lib/village-data";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming and past events in Lodhaura village.",
};

export default function EventsPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

  return (
    <>
      <PageHeader
        title="Events & Gatherings"
        subtitle="Festivals, gram sabha meetings, health camps and community programs"
        badge="Community Calendar"
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Upcoming Events" subtitle="With live countdown" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.length > 0 ? (
              upcoming.map((event) => (
                <EventCard key={event.id} event={event} showCountdown />
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming events at the moment.</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Past Events" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
