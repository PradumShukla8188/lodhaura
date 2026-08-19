import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { NewsCard } from "@/components/NewsCard";
import { newsItems } from "@/lib/village-data";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Latest announcements and breaking news from Lodhaura gram panchayat.",
};

export default function NewsPage() {
  const breaking = newsItems.filter((n) => n.isBreaking);
  const regular = newsItems.filter((n) => !n.isBreaking);

  return (
    <>
      <PageHeader
        title="News & Updates"
        subtitle="Official announcements, scheme updates and community highlights"
        badge="Stay Informed"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {breaking.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-foreground">Breaking News</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {breaking.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
