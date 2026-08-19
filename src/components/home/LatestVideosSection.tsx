"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Eye } from "lucide-react";
import { villageVideos } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";

export function LatestVideosSection() {
  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Latest Videos" subtitle="Watch village moments" href="/videos" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {villageVideos.map((video, i) => (
            <motion.div key={video.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Link href="/videos" className="group block">
                <div className="glass overflow-hidden rounded-2xl border-white/20">
                  <div className="relative aspect-[9/16] max-h-64">
                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="250px" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-10 w-10 fill-white text-white" />
                    </div>
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">{video.duration}</span>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {video.views.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
