import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" subtitle="How we collect, use and protect your information" badge="Legal" />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p><strong className="text-foreground">Last updated:</strong> June 2025</p>
            <h2 className="text-xl font-bold text-foreground">Information We Collect</h2>
            <p>When you register, contact us, or use portal services, we may collect your name, email, phone number, and usage data necessary to provide gram panchayat services.</p>
            <h2 className="text-xl font-bold text-foreground">How We Use Information</h2>
            <p>Data is used to process service requests, send community updates, improve the portal, and comply with applicable government regulations.</p>
            <h2 className="text-xl font-bold text-foreground">Data Security</h2>
            <p>We implement reasonable technical and organizational measures to protect personal information. Authentication tokens are stored locally in your browser.</p>
            <h2 className="text-xl font-bold text-foreground">Contact</h2>
            <p>For privacy-related queries, email panchayat@lodhaura.in or visit the <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
