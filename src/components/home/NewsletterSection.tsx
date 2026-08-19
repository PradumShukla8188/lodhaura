"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Subscribed! You'll receive village updates.");
      setEmail("");
      setLoading(false);
    }, 800);
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
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass sm:max-w-xs"
              />
              <Button type="submit" disabled={loading} className="gap-2">
                <Send className="h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
