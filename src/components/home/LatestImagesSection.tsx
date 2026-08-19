"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { galleryImages } from "@/lib/village-data";
import { SectionTitle } from "@/components/SectionTitle";

export function LatestImagesSection() {
  const images = galleryImages.slice(0, 6);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Latest Gallery" subtitle="Moments from Lodhaura" href="/gallery" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {images.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className={i === 0 ? "col-span-2 row-span-2 sm:col-span-1" : ""}>
              <Link href="/gallery" className="group block overflow-hidden rounded-2xl">
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={img.url} alt={img.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="300px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <p className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">{img.title}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
