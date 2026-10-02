"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, AlertTriangle, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { contentApi } from "@/lib/api-services";

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await contentApi.getEmergencyContacts();
        setContacts(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch emergency contacts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()) ||
    (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Ambulance': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Police': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Fire': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Hospital':
      case 'Clinic': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Pharmacy': return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      case 'Village Emergency': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <PageHeader
        title="Emergency & Health Information"
        subtitle="Important contacts for medical emergencies, police, fire, and village authorities"
        badge="24/7 Support"
      />
      
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 rounded-2xl bg-destructive/10 border border-destructive/20 p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 bg-destructive/20 text-destructive rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-destructive">In case of extreme emergency</h3>
              <p className="text-muted-foreground mt-1">
                Please call National Emergency Number <strong>112</strong> immediately. For ambulance services, dial <strong>108</strong>.
              </p>
            </div>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, category (e.g., Ambulance), or location..."
              className="pl-10 h-14 text-lg bg-background/50 border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-white/20">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No contacts found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredContacts.map((contact) => (
                <Card key={contact._id} className="glass border-white/20 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className={getCategoryColor(contact.category)}>
                        {contact.category}
                      </Badge>
                      {contact.isAvailable24x7 && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent">
                          24/7
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{contact.name}</h3>
                    {contact.description && (
                      <p className="text-sm text-muted-foreground mb-4">{contact.description}</p>
                    )}
                    
                    <div className="space-y-3 mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Phone className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Phone Number</p>
                          <a href={`tel:${contact.phone}`} className="font-semibold text-lg hover:text-primary transition-colors">
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                      
                      {contact.address && (
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="text-sm font-medium">{contact.address}</p>
                            {contact.locationLink && (
                              <a href={contact.locationLink} target="_blank" rel="noreferrer" className="text-primary text-xs font-semibold hover:underline mt-1 inline-block">
                                Get Directions &rarr;
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
