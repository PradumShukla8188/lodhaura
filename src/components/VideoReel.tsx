"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import { Play, Eye } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { cn } from "@/lib/utils";

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  views: number;
  duration: string;
}

interface VideoReelProps {
  videos: VideoItem[];
  className?: string;
}

export function VideoReel({ videos, className }: VideoReelProps) {
  const activeIndex = useRef(0);

  return (
    <div className={cn("mx-auto max-w-md", className)}>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={16}
        mousewheel
        pagination={{ clickable: true }}
        modules={[Mousewheel, Pagination]}
        className="h-[70vh] rounded-3xl"
        onSlideChange={(swiper) => {
          activeIndex.current = swiper.activeIndex;
        }}
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <div className="relative h-full overflow-hidden rounded-3xl bg-black shadow-2xl">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <iframe
                src={video.url}
                title={video.title}
                className="absolute inset-0 h-full w-full opacity-0 hover:opacity-100 transition-opacity"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Play className="h-8 w-8 fill-white text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {video.views.toLocaleString()} views
                  </span>
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
