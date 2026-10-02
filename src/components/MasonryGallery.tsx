"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, X } from "lucide-react";
import { galleryCategories } from "@/lib/village-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  likes: number;
  comments: number;
}

interface MasonryGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function MasonryGallery({ images, className }: MasonryGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={className}>
      <div className="mb-8 flex flex-wrap gap-2">
        {galleryCategories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="mb-4 break-inside-avoid"
          >
            <div className="group glass overflow-hidden rounded-2xl border-white/20">
              <div 
                className="relative aspect-auto overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={image.title}
                  width={600}
                  height={index % 3 === 0 ? 500 : index % 3 === 1 ? 400 : 450}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform group-hover:translate-y-0">
                  <p className="text-sm font-medium text-white">{image.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-xs text-muted-foreground">{image.category}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleLike(image.id)}
                    className={cn(
                      "flex items-center gap-1 text-xs transition-colors",
                      liked.has(image.id) ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", liked.has(image.id) && "fill-current")} />
                    {image.likes + (liked.has(image.id) ? 1 : 0)}
                  </button>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    {image.comments}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Screen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 z-50 rounded-full text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative max-h-full max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImage} 
                alt="Fullscreen View" 
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
