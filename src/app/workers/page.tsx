"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Briefcase, IndianRupee } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { workerService, WorkerProfile } from "@/lib/api-workers";

const CATEGORIES = ["All", "Electrician", "Plumber", "Carpenter", "Painter", "Mason", "Laborer", "Driver", "Mechanic", "Other"];

export default function FindWorkersPage() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchWorkers();
  }, [category, maxPrice]);

  const fetchWorkers = async (searchQuery: string = search) => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (category !== "All") params.category = category;
      if (maxPrice) params.maxPrice = maxPrice;
      
      const res = await workerService.getWorkers(params);
      if (res.data) setWorkers(res.data);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkers(search);
  };

  return (
    <>
      <PageHeader
        title="Find Workers"
        subtitle="Hire verified local professionals and skilled laborers for your needs"
        badge="Community Service"
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Search and Filter */}
          <div className="mb-8 rounded-2xl glass p-6 shadow-lg border border-white/20">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, category, or skill..."
                  className="pl-10 h-12 bg-background/50 border-white/10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48 relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Max Price / Day"
                  className="pl-9 h-12 bg-background/50 border-white/10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 px-8">Search</Button>
            </form>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Worker List */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl border border-white/20">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No workers found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workers.map((worker) => (
                <div key={worker._id} className="glass rounded-2xl p-6 border border-white/20 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {worker.userId?.avatar ? (
                        <img src={worker.userId.avatar} alt={worker.name} className="h-14 w-14 rounded-full object-cover shadow-sm" />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                          {worker.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{worker.name}</h3>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {worker.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="line-clamp-1">{worker.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 shrink-0 text-amber-500 fill-amber-500" />
                      <span>{worker.averageRating > 0 ? worker.averageRating.toFixed(1) : "New"} ({worker.totalReviews} reviews)</span>
                      <span className="mx-1">•</span>
                      <span>{worker.experience} exp</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {worker.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] bg-muted px-2 py-1 rounded-md text-muted-foreground">
                          {skill}
                        </span>
                      ))}
                      {worker.skills.length > 3 && (
                        <span className="text-[10px] bg-muted px-2 py-1 rounded-md text-muted-foreground">
                          +{worker.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center font-bold text-lg text-foreground">
                        <IndianRupee className="h-4 w-4 mr-0.5" />
                        {worker.pricePerDay}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/ day</span>
                      </div>
                      {worker.pricePerHour && (
                        <div className="text-xs text-muted-foreground">
                          or ₹{worker.pricePerHour} / hour
                        </div>
                      )}
                    </div>
                    <Link href={`/workers/${worker._id}`}>
                      <Button variant="default">View Details</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
