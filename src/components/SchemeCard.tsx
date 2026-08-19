import { Building2, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Scheme } from "@/lib/village-data";
import { cn } from "@/lib/utils";

interface SchemeCardProps {
  scheme: Scheme;
  className?: string;
}

export function SchemeCard({ scheme, className }: SchemeCardProps) {
  const Icon = scheme.level === "central" ? Landmark : Building2;

  return (
    <Card className={cn("glass h-full border-white/20 transition-all hover:-translate-y-1 hover:shadow-lg", className)}>
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-village text-white">
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant={scheme.level === "central" ? "default" : "secondary"} className="capitalize">
            {scheme.level}
          </Badge>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">{scheme.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{scheme.description}</p>
        <div className="mt-4 space-y-2 rounded-xl bg-muted/40 p-3 text-xs">
          <p><span className="font-semibold text-foreground">Eligibility:</span> {scheme.eligibility}</p>
          <p><span className="font-semibold text-foreground">Benefits:</span> {scheme.benefits}</p>
        </div>
      </CardContent>
    </Card>
  );
}
