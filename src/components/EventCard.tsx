"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/lib/village-data";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  showCountdown?: boolean;
  className?: string;
}

const typeColors = {
  meeting: "bg-primary/10 text-primary",
  community: "bg-secondary/10 text-secondary",
  festival: "bg-accent/10 text-accent",
};

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export function EventCard({ event, showCountdown, className }: EventCardProps) {
  const countdown = useCountdown(event.date);
  const isUpcoming = new Date(event.date) >= new Date();

  return (
    <Card className={cn("glass overflow-hidden border-white/20 transition-all hover:shadow-lg", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge className={cn("capitalize", typeColors[event.type])}>{event.type}</Badge>
          {isUpcoming && <Badge variant="secondary">Upcoming</Badge>}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-foreground">{event.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            {new Date(event.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {event.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {event.location}
          </div>
        </div>
        {showCountdown && isUpcoming && !countdown.expired && (
          <div className="mt-4 grid grid-cols-4 gap-2 rounded-xl bg-muted/50 p-3 text-center">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hrs", value: countdown.hours },
              { label: "Min", value: countdown.minutes },
              { label: "Sec", value: countdown.seconds },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-lg font-bold text-primary">{item.value}</p>
                <p className="text-[10px] uppercase text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
