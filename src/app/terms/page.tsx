import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Service" subtitle="Rules and guidelines for using the Lodhaura Village Portal" badge="Legal" />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p><strong className="text-foreground">Last updated:</strong> June 2025</p>
            <h2 className="text-xl font-bold text-foreground">Acceptance of Terms</h2>
            <p>By accessing the Lodhaura Village Portal, you agree to these terms and applicable local laws governing digital gram panchayat services.</p>
            <h2 className="text-xl font-bold text-foreground">User Responsibilities</h2>
            <p>Users must provide accurate information, respect community guidelines, and refrain from posting offensive, misleading, or illegal content.</p>
            <h2 className="text-xl font-bold text-foreground">Content Moderation</h2>
            <p>The gram panchayat reserves the right to review, approve, or remove user-submitted content. Admin decisions on service requests are subject to official procedures.</p>
            <h2 className="text-xl font-bold text-foreground">Limitation of Liability</h2>
            <p>The portal is provided as a community service. While we strive for accuracy, information may change. Always verify critical details with panchayat officials.</p>
            <h2 className="text-xl font-bold text-foreground">Contact</h2>
            <p>Questions about these terms? Reach us via the <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
