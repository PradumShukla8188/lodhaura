import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { NewsItem } from "@/lib/village-data";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  news: NewsItem;
  className?: string;
}

export function NewsCard({ news, className }: NewsCardProps) {
  return (
    <Card className={cn("glass group overflow-hidden border-white/20 transition-all hover:-translate-y-0.5 hover:shadow-lg", className)}>
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{news.category}</Badge>
          {news.isBreaking && (
            <Badge variant="accent" className="animate-pulse">
              Breaking
            </Badge>
          )}
        </div>
        <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-primary sm:text-lg">
          {news.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{news.excerpt}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(news.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </CardContent>
    </Card>
  );
}
