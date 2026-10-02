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
  // Map API fields if they differ from static data
  const isBreaking = news.isBreaking || news.priority === 'urgent' || news.priority === 'high';
  const categoryName = typeof news.category === 'object' ? (news.category as any)?.name : news.category || 'Notice';
  const dateStr = news.date || news.createdAt || new Date().toISOString();
  
  return (
    <Card className={cn("glass group overflow-hidden border-white/20 transition-all hover:-translate-y-0.5 hover:shadow-lg flex flex-col h-full", className)}>
      <div className={cn("h-1 w-full", news.priority === 'urgent' ? "bg-red-500" : news.priority === 'high' ? "bg-orange-500" : "bg-gradient-to-r from-primary via-secondary to-accent")} />
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{categoryName}</Badge>
          {isBreaking && (
            <Badge variant="destructive" className="animate-pulse">
              {news.priority === 'urgent' ? 'Urgent' : 'Breaking'}
            </Badge>
          )}
        </div>
        <h3 className="mt-3 text-base font-semibold text-foreground group-hover:text-primary sm:text-lg">
          {news.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-1">{news.excerpt || news.summary || news.content}</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          {news.attachments && news.attachments.length > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {news.attachments.length} Attachment(s)
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
