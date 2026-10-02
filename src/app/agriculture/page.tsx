"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Tractor, Search, Loader2, IndianRupee, Sprout } from "lucide-react";
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

const serviceTypes = [
  "Tractor Rental", "Harvester", "Seeds & Fertilizer", 
  "Water Pump", "Labor", "Other"
];

export default function AgricultureServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await contentApi.getAgricultureServices(selectedType, search);
      setServices(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch agriculture services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchServices();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search, selectedType]);

  const onSubmitRegister = async (data: any) => {
    if (!isAuthenticated) {
      toast.error("Please login to register a service.");
      return;
    }
    setIsSubmitting(true);
    try {
      await contentApi.registerAgricultureService(data);
      toast.success("Service registered successfully! Waiting for admin approval.");
      setIsRegisterOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to register service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Agriculture Services"
        subtitle="Rent tractors, buy seeds & fertilizers, or hire labor for your farm"
        badge="Kisan Portal"
      />
      
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex-1 w-full max-w-2xl flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services or providers..."
                  className="pl-9 bg-background/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background/50">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Services</SelectItem>
                  {serviceTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
              <DialogTrigger asChild>
                <Button className="shrink-0 bg-green-600 hover:bg-green-700 text-white">
                  <Sprout className="mr-2 h-4 w-4" />
                  List Your Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-strong border-white/20">
                <DialogHeader>
                  <DialogTitle>List Your Agriculture Service</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitRegister)} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Provider Name *</Label>
                      <Input {...register("providerName", { required: true })} placeholder="e.g. Ramesh Kumar" />
                    </div>
                    <div className="space-y-2">
                      <Label>Service Type *</Label>
                      <select 
                        {...register("type", { required: true })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select Type</option>
                        {serviceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input {...register("phone", { required: true })} placeholder="10-digit number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Price / Rate</Label>
                      <Input {...register("priceRate")} placeholder="e.g. 500 Rs/hour" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea {...register("address")} placeholder="Village area or exact location..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea {...register("description", { required: true })} placeholder="Details about your equipment, capacity, etc." />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit for Approval"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-green-500" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-white/20">
              <Tractor className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No services found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service._id} className="glass group overflow-hidden border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 flex flex-col h-full">
                  <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-green-500/10 blur-2xl transition-all group-hover:bg-green-500/20" />
                  <CardContent className="p-6 flex-1 flex flex-col relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-white/10 shadow-inner">
                        {service.type === 'Tractor Rental' || service.type === 'Harvester' ? (
                          <Tractor className="h-6 w-6 text-green-600" />
                        ) : (
                          <Sprout className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <Badge variant="outline" className="bg-background/50 backdrop-blur-md text-green-600 border-green-500/30">
                        {service.type}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1 flex items-center gap-2 group-hover:text-green-600 transition-colors">
                      {service.providerName}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {service.description}
                    </p>
                    
                    <div className="space-y-3 mt-auto pt-4 border-t border-white/10">
                      {service.priceRate && (
                        <div className="flex items-center gap-3">
                          <IndianRupee className="h-4 w-4 text-green-600 shrink-0" />
                          <p className="text-sm font-semibold text-green-600">{service.priceRate}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a href={`tel:${service.phone}`} className="text-sm font-medium hover:text-green-600 transition-colors">
                          {service.phone}
                        </a>
                      </div>
                      
                      {service.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm line-clamp-1">{service.address}</p>
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
