"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { contentApi } from "@/lib/api-services";
import {
  blogs,
  events,
  newsItems,
  governmentSchemes,
  searchSuggestions,
} from "@/lib/village-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function localSearch(q: string) {
  const query = q.toLowerCase();
  const results: { type: string; title: string; href: string }[] = [];

  blogs.forEach((b) => {
    if (b.title.toLowerCase().includes(query) || b.excerpt.toLowerCase().includes(query))
      results.push({ type: "Blog", title: b.title, href: `/blogs/${b.slug}` });
  });
  events.forEach((e) => {
    if (e.title.toLowerCase().includes(query))
      results.push({ type: "Event", title: e.title, href: "/events" });
  });
  newsItems.forEach((n) => {
    if (n.title.toLowerCase().includes(query))
      results.push({ type: "News", title: n.title, href: "/news" });
  });
  governmentSchemes.forEach((s) => {
    if (s.title.toLowerCase().includes(query))
      results.push({ type: "Scheme", title: s.title, href: "/government-schemes" });
  });

  return results;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const { data: apiResults, isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const res = await contentApi.search(query);
      return res.data.data ?? res.data;
    },
    enabled: query.length >= 2,
    retry: false,
  });

  const results = query.length >= 2
    ? (apiResults?.length ? apiResults.map((r: { title: string; type: string; url?: string }) => ({
        type: r.type,
        title: r.title,
        href: r.url ?? "/",
      })) : localSearch(query))
    : [];

  return (
    <>
      <PageHeader title="Search" subtitle="Find blogs, events, news, schemes and more" badge="Global Search" />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search directory, events, services..."
              className="glass pl-12"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {query.length < 2 && (
            <div className="mt-8">
              <p className="text-sm text-muted-foreground">Popular searches:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {searchSuggestions.map((s) => (
                  <button key={s} type="button" onClick={() => setQuery(s)}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">{s}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isFetching && (
            <div className="mt-8 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          )}

          {!isFetching && results.length > 0 && (
            <div className="mt-8 space-y-3">
              {results.map((r: { type: string; title: string; href: string }, i: number) => (
                <Link key={i} href={r.href}>
                  <Card className="glass border-white/20 transition-all hover:shadow-md">
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="font-medium">{r.title}</span>
                      <Badge variant="secondary">{r.type}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {!isFetching && query.length >= 2 && results.length === 0 && (
            <p className="mt-8 text-center text-muted-foreground">No results found for &ldquo;{query}&rdquo;</p>
          )}
        </div>
      </section>
    </>
  );
}
