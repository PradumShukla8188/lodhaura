"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FileText, Home, Landmark, Phone, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { onlineServices } from "@/lib/village-data";
import { complaintSchema, suggestionSchema, type ComplaintFormData, type SuggestionFormData } from "@/lib/auth-schemas";
import { formApi } from "@/lib/api-services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const iconMap = {
  file: FileText,
  home: Home,
  landmark: Landmark,
  phone: Phone,
};

export default function ServicesPage() {
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const complaintForm = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { category: "general" },
    mode: "onTouched",
  });

  const suggestionForm = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
    mode: "onTouched",
  });

  const onComplaint = async (data: ComplaintFormData) => {
    setComplaintLoading(true);
    try {
      await formApi.submitComplaint(data);
      toast.success("Complaint submitted! Reference: LV-" + Date.now().toString().slice(-6));
      complaintForm.reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setComplaintLoading(false);
    }
  };

  const onSuggestion = async (data: SuggestionFormData) => {
    setSuggestionLoading(true);
    try {
      await formApi.submitSuggestion(data);
      toast.success("Thank you for your suggestion!");
      suggestionForm.reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit suggestion.");
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Panchayat Services"
        subtitle="Apply for certificates, submit grievances, and access online services"
        badge="Citizen Services"
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Online Services" subtitle="Available through gram panchayat" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {onlineServices.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <Card key={service.title} className="glass border-white/20 transition-all hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-village text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant={service.status === "available" ? "secondary" : "outline"}>
                        {service.status === "available" ? "Available" : "Coming Soon"}
                      </Badge>
                    </div>
                    <h3 className="mt-4 font-semibold">{service.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Feedback & Grievances" />
          <Tabs defaultValue="complaint">
            <TabsList>
              <TabsTrigger value="complaint">File Complaint</TabsTrigger>
              <TabsTrigger value="suggestion">Give Suggestion</TabsTrigger>
            </TabsList>

            <TabsContent value="complaint">
              <Card className="glass max-w-2xl border-white/20">
                <CardContent className="p-6">
                  <form onSubmit={complaintForm.handleSubmit(onComplaint)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input error={complaintForm.formState.errors.name?.message} {...complaintForm.register("name")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Controller
                          control={complaintForm.control}
                          name="phone"
                          render={({ field }) => (
                            <PhoneInput
                              placeholder="Enter phone number"
                              defaultCountry="IN"
                              error={complaintForm.formState.errors.phone?.message}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select className="flex h-10 w-full rounded-xl border border-border bg-background/80 px-4 text-sm" {...complaintForm.register("category")}>
                        <option value="general">General</option>
                        <option value="water">Water Supply</option>
                        <option value="road">Roads</option>
                        <option value="electricity">Electricity</option>
                        <option value="sanitation">Sanitation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input error={complaintForm.formState.errors.subject?.message} {...complaintForm.register("subject")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea error={complaintForm.formState.errors.description?.message} {...complaintForm.register("description")} />
                    </div>
                    <Button type="submit" disabled={complaintLoading}>
                      {complaintLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Complaint"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestion">
              <Card className="glass max-w-2xl border-white/20">
                <CardContent className="p-6">
                  <form onSubmit={suggestionForm.handleSubmit(onSuggestion)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input error={suggestionForm.formState.errors.name?.message} {...suggestionForm.register("name")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" error={suggestionForm.formState.errors.email?.message} {...suggestionForm.register("email")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Input error={suggestionForm.formState.errors.topic?.message} {...suggestionForm.register("topic")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Suggestion</Label>
                      <Textarea error={suggestionForm.formState.errors.suggestion?.message} {...suggestionForm.register("suggestion")} />
                    </div>
                    <Button type="submit" disabled={suggestionLoading}>
                      {suggestionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Suggestion"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
