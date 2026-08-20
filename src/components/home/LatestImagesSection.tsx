"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { galleryImages } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";
import { cn } from "@/lib/utils";

export function LatestImagesSection() {
  // Use exactly 5 images for a perfect 3x3 Bento Grid layout
  const images = galleryImages.slice(0, 5);

  const getGridClasses = (index: number) => {
    switch (index) {
      case 0:
        return "col-span-1 sm:col-span-2 sm:row-span-2"; // Large feature image
      case 1:
      case 2:
        return "col-span-1 sm:col-span-1 sm:row-span-1"; // Standard square images
      case 3:
        return "col-span-1 sm:col-span-1 sm:row-span-1"; // Standard square image on bottom row
      case 4:
        return "col-span-1 sm:col-span-2 sm:row-span-1"; // Wide landscape image on bottom row
      default:
        return "col-span-1 sm:col-span-1 sm:row-span-1";
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Latest Gallery" subtitle="Moments from Lodhaura" href="/gallery" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:auto-rows-[250px] lg:gap-4">
          {images.map((img, i) => (
            <motion.div 
              key={img.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }} 
              className={cn("group block overflow-hidden rounded-2xl relative min-h-[250px] sm:min-h-0", getGridClasses(i))}
            >
              <Link href="/gallery" className="absolute inset-0 block h-full w-full">
                <Image 
                  src={img.url} 
                  alt={img.title} 
                  fill 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-2 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-medium text-white/80 mb-1">{img.category}</p>
                  <h3 className={cn("font-bold text-white tracking-tight", i === 0 ? "text-xl sm:text-2xl" : "text-lg")}>
                    {img.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
