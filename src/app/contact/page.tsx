"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, MapPin, Phone, Shield, Heart, Flame, Zap } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SectionTitle } from "@/components/SectionTitle";
import { MapEmbed } from "@/components/MapEmbed";
import { villageInfo, emergencyContacts } from "@/lib/village-data";
import { formApi } from "@/lib/api-services";
import { contactSchema, type ContactFormData } from "@/lib/auth-schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const emergencyIcons = {
  shield: Shield,
  heart: Heart,
  flame: Flame,
  phone: Phone,
  zap: Zap,
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      await formApi.submitContact(data);
      toast.success("Message sent! Panchayat will respond within 48 hours.");
      reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Reach the gram panchayat office, helplines and emergency services"
        badge="We're Here to Help"
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionTitle title="Send a Message" />
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input error={errors.name?.message} {...register("name")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" error={errors.email?.message} {...register("email")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone (optional)</Label>
                      <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => (
                          <PhoneInput
                            placeholder="Enter phone number"
                            defaultCountry="IN"
                            error={errors.phone?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input error={errors.subject?.message} {...register("subject")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea error={errors.message?.message} {...register("message")} />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-primary" />
                  {villageInfo.name}, {villageInfo.district}, {villageInfo.state} — {villageInfo.pincode}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-5 w-5 text-primary" />
                  +91 8188898587
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-5 w-5 text-primary" />
                  pradumshukla1133@gmail.com
                </div>
              </div> */}
            </div>

            <div>
              <SectionTitle title="Location" />
              <MapEmbed height="460px" />
            </div>
          </div>
        </div>
      </section>

      <section id="feedback" className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Emergency Numbers" subtitle="Save these for urgent situations" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emergencyContacts.map((contact) => {
              const Icon = emergencyIcons[contact.icon];
              return (
                <Card key={contact.name} className="glass border-white/20">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-lg font-bold text-primary">{contact.number}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
