"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { VideoReel } from "@/components/VideoReel";
import { villageVideos } from "@/lib/village-data";
import { contentApi } from "@/lib/api-services";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideosPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const res = await contentApi.getVideos();
      return res.data.data ?? res.data;
    },
    retry: false,
  });

  const videos = isError || !data?.length
    ? villageVideos
    : data.map((v: { _id: string; title: string; thumbnail?: string; url: string; views?: number; duration?: string }) => ({
        id: v._id,
        title: v.title,
        thumbnail: v.thumbnail ?? villageVideos[0].thumbnail,
        url: v.url,
        views: v.views ?? 0,
        duration: v.duration ?? "0:00",
      }));

  return (
    <>
      <PageHeader
        title="Village Videos"
        subtitle="Swipe through reels-style videos from Lodhaura"
        badge="Watch & Share"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <Skeleton className="mx-auto h-[70vh] max-w-md rounded-3xl" />
          ) : (
            <VideoReel videos={videos} />
          )}
        </div>
      </section>
    </>
  );
}
