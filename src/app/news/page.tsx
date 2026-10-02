"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { NewsCard } from "@/components/NewsCard";
import { contentApi } from "@/lib/api-services";
import { Loader2, AlertCircle } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await contentApi.getNews();
        // Filter out expired notices
        const activeNews = (res.data.data || []).filter((item: any) => {
          if (!item.expiryDate) return true;
          return new Date(item.expiryDate) > new Date();
        });
        setNews(activeNews);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const urgentNews = news.filter((n) => n.priority === 'urgent' || n.priority === 'high' || n.isBreaking);
  const regularNews = news.filter((n) => n.priority !== 'urgent' && n.priority !== 'high' && !n.isBreaking);

  return (
    <>
      <PageHeader
        title="Village Notice Board"
        subtitle="Official announcements, government notices, and community updates"
        badge="Stay Informed"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16 glass rounded-xl border border-white/10">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No active notices</h3>
              <p className="text-muted-foreground">Check back later for updates from the gram panchayat.</p>
            </div>
          ) : (
            <>
              {urgentNews.length > 0 && (
                <div className="mb-10">
                  <h2 className="mb-4 text-xl font-bold text-foreground">Important Notices</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {urgentNews.map((item) => (
                      <NewsCard key={item._id || item.id} news={item} />
                    ))}
                  </div>
                </div>
              )}
              {regularNews.length > 0 && (
                <div>
                  {urgentNews.length > 0 && <h2 className="mb-4 text-xl font-bold text-foreground">Recent Updates</h2>}
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {regularNews.map((item) => (
                      <NewsCard key={item._id || item.id} news={item} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
