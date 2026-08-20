"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { governanceApi } from "@/lib/api-services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PublicEventsPage() {
  const router = useRouter();

  const { data: response, isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => (await governanceApi.getEvents(false)).data,
  });

  const events = response?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 mt-16">
      <PageHeader 
        title="Village Events & Activities" 
        subtitle="Discover, participate, and contribute to upcoming community events." 
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event: any) => (
            <Card key={event._id} className="group glass border-white/20 hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col cursor-pointer"
                  onClick={() => router.push(`/events/${event._id}`)}>
              {event.featuredImage ? (
                <div className="h-56 w-full relative overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <img src={event.featuredImage} alt={event.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 right-3 z-20">
                    <Badge className="bg-primary/90 hover:bg-primary backdrop-blur">{event.status}</Badge>
                  </div>
                  <div className="absolute bottom-3 left-4 z-20 text-white">
                    <h3 className="font-bold text-xl line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs opacity-90 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> {new Date(event.startDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/> {event.venueName || 'Village'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-56 w-full bg-gradient-village relative overflow-hidden flex items-center justify-center border-b border-white/10">
                  <div className="absolute top-3 right-3 z-20"><Badge variant="secondary">{event.status}</Badge></div>
                  <div className="text-center text-white px-4">
                    <h3 className="font-bold text-2xl line-clamp-2">{event.title}</h3>
                    <p className="text-sm opacity-80 mt-2">{new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {event.shortDescription || event.description || "Join us for this community event."}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  {event.enableRegistration ? (
                    <span className="text-xs font-medium flex items-center gap-1.5 text-blue-400">
                      <Users className="h-3.5 w-3.5" /> {event.totalParticipants || 0} Attending
                    </span>
                  ) : <span />}
                  <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {events.length === 0 && (
            <div className="col-span-full p-16 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">No events at the moment</h3>
              <p className="text-muted-foreground mt-2">Check back later for upcoming community activities.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
