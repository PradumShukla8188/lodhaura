"use client";

import { ExternalLink, ShieldAlert, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

export default function JansunwaiPage() {
  return (
    <>
      <PageHeader
        title="Jansunwai Complaint"
        subtitle="Register your grievances directly on the official UP Jansunwai Portal"
        badge="Official UP Government Portal"
      />
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <div className="mb-6 rounded-full bg-destructive/10 p-5 text-destructive">
            <ShieldAlert className="h-12 w-12" />
          </div>
          
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Secure Portal Redirection
          </h2>
          
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            Due to strict security policies implemented by the UP Government, the official Jansunwai portal cannot be embedded directly within other websites. 
            <br className="hidden sm:block" />
            <br className="hidden sm:block" />
            To ensure your data remains secure and to file your complaint successfully, please access the portal directly using the secure link below.
          </p>
          
          <a href="https://jansunwai.up.nic.in/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="h-14 gap-2 px-8 text-lg shadow-xl shadow-primary/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30">
              Open Official Jansunwai Portal
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </a>
          
          <div className="mt-12 flex items-center gap-2 text-sm text-muted-foreground/80 bg-muted/30 px-4 py-2 rounded-full border border-white/5">
            <AlertCircle className="h-4 w-4" />
            You will be redirected to: https://jansunwai.up.nic.in/
          </div>
        </div>
      </section>
    </>
  );
}
