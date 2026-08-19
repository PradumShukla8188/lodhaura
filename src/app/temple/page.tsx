import type { Metadata } from "next";
import Image from "next/image";
import { Clock, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { templeInfo } from "@/lib/village-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Mata Rani Mandir",
  description: "Temple history, timings and festivals at Mata Rani Mandir, Lodhaura.",
};

export default function TemplePage() {
  return (
    <>
      <PageHeader
        title={templeInfo.name}
        subtitle={templeInfo.description}
        badge="Sacred Heritage"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
              <Image src={templeInfo.image} alt={templeInfo.name} fill className="object-cover" sizes="600px" />
            </div>
            <div className="space-y-6">
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Temple Timings</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">{templeInfo.timings}</p>
                </CardContent>
              </Card>
              <Card className="glass border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Major Festivals</h3>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {templeInfo.festivals.map((f) => (
                      <Badge key={f} variant="secondary">{f}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <p className="leading-relaxed text-muted-foreground">{templeInfo.history}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
