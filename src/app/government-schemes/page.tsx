import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SchemeCard } from "@/components/SchemeCard";
import { governmentSchemes } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Government Schemes",
  description: "Central and state government schemes available for Lodhaura residents.",
};

export default function GovernmentSchemesPage() {
  const central = governmentSchemes.filter((s) => s.level === "central");
  const state = governmentSchemes.filter((s) => s.level === "state");

  return (
    <>
      <PageHeader
        title="Government Schemes"
        subtitle="Central and state benefits for farmers, families and vulnerable households"
        badge="Yojana & Benefits"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Central Government Schemes" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {central.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="State Government Schemes" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {state.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
