"use client";

import { governmentSchemes } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";
import { SchemeCard } from "@/components/SchemeCard";

export function SchemesSection() {
  const schemes = governmentSchemes.slice(0, 3);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Government Schemes" subtitle="Benefits for our residents" href="/government-schemes" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </div>
    </section>
  );
}
