"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { MasonryGallery } from "@/components/MasonryGallery";
import { galleryImages } from "@/lib/village-data";
import { contentApi } from "@/lib/api-services";
import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await contentApi.getImages();
      return res.data.data;
    },
    retry: false,
  });

  const images = isError || !data?.length
    ? galleryImages
    : data.map((img) => ({
        id: img._id,
        title: img.title || img.caption || "Photo",
        url: img.url,
        category: img.category ?? "Community",
        likes: img.likes ?? 0,
        comments: img.comments ?? 0,
      }));

  return (
    <>
      <PageHeader
        title="Photo Gallery"
        subtitle="Festivals, fields, temple, school and everyday life in Lodhaura"
        badge="Visual Stories"
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : (
            <MasonryGallery images={images} />
          )}
        </div>
      </section>
    </>
  );
}
