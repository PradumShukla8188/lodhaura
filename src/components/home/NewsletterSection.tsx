"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema, type NewsletterFormData } from "@/lib/auth-schemas";
import { formApi } from "@/lib/api-services";

export function NewsletterSection() {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setLoading(true);
    try {
      await formApi.subscribeNewsletter(data);
      toast.success("Subscribed! You'll receive village updates.");
      reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-strong relative overflow-hidden rounded-3xl border-white/20 p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-village opacity-[0.08]" />
          <div className="relative mx-auto max-w-2xl text-center">
            <Mail className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Stay Connected</h2>
            <p className="mt-3 text-muted-foreground">
              Subscribe for panchayat updates, event reminders, and community news delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center" noValidate>
              <Input
                type="email"
                placeholder="your@email.com"
                className="glass sm:max-w-xs"
                error={errors.email?.message}
                {...register("email")}
              />
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" /> : <Send className="h-4 w-4" />}
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
