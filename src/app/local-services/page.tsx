"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Store, Search, Loader2, Clock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contentApi } from "@/lib/api-services";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const categories = [
  "Grocery", "Medical Store", "Clinic", "Mechanic",
  "Restaurant", "Electrician", "Plumber", "School",
  "Coaching", "Transport", "Agriculture", "Other"
];

export default function LocalServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await contentApi.getLocalServices(selectedCategory, search);
      setServices(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch local services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Delay search to debounce
    const timeout = setTimeout(() => {
      fetchServices();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, selectedCategory]);

  const onSubmitRegister = async (data: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to register a business.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Split servicesOffered by comma
      const servicesOffered = data.servicesOffered ? data.servicesOffered.split(',').map((s: string) => s.trim()) : [];
      await contentApi.registerLocalService({ ...data, servicesOffered });
      toast.success("Business registered successfully! Waiting for admin approval.");
      setIsRegisterOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to register business.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Local Services Directory"
        subtitle="Find local shops, mechanics, electricians, and other businesses in Lodhaura"
        badge="Community Directory"
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex-1 w-full max-w-2xl flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search businesses or services..."
                  className="pl-9 bg-background/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0 bg-primary hover:bg-primary/90">
                  <Store className="mr-2 h-4 w-4" />
                  Register Business
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-strong border-white/20">
                <DialogHeader>
                  <DialogTitle>Register Your Business</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Business Name *</Label>
                      <Input {...register("businessName", { required: true })} placeholder="e.g. Sharma Grocery" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <select
                        {...register("category", { required: true })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input {...register("phone", { required: true })} placeholder="10-digit number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Opening Hours</Label>
                      <Input {...register("openingHours")} placeholder="e.g. 9 AM - 8 PM" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Services Offered (comma separated)</Label>
                    <Input {...register("servicesOffered")} placeholder="e.g. Home Delivery, Fresh Veggies" />
                  </div>
                  <div className="space-y-2">
                    <Label>Address *</Label>
                    <Textarea {...register("address", { required: true })} placeholder="Shop 12, Main Market, Lodhaura" />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Maps Link (Optional)</Label>
                    <Input {...register("locationLink")} placeholder="https://maps.google.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea {...register("description", { required: true })} placeholder="Brief description of your business..." />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit for Approval"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-white/20">
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No businesses found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or category.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service._id} className="glass group overflow-hidden border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full">
                  <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
                  <CardContent className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 shadow-inner">
                        <Store className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="bg-background/50 backdrop-blur-md">
                        {service.category}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-1 flex items-center gap-2 group-hover:text-primary transition-colors">
                      {service.businessName}
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {service.description}
                    </p>

                    {service.servicesOffered && service.servicesOffered.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {service.servicesOffered.slice(0, 3).map((s: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px] bg-primary/5 text-primary/80 border-primary/10">
                            {s}
                          </Badge>
                        ))}
                        {service.servicesOffered.length > 3 && (
                          <Badge variant="secondary" className="text-[10px] bg-muted/50 text-muted-foreground">
                            +{service.servicesOffered.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="space-y-3 mt-auto pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a href={`tel:${service.phone}`} className="text-sm font-medium hover:text-primary transition-colors">
                          {service.phone}
                        </a>
                      </div>

                      {service.openingHours && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          <p className="text-sm">{service.openingHours}</p>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm line-clamp-1">{service.address}</p>
                          {service.locationLink && (
                            <a href={service.locationLink} target="_blank" rel="noreferrer" className="text-primary text-[10px] font-semibold hover:underline mt-0.5 block">
                              Directions
                            </a>
                          )}
                        </div>
                      </div>
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
