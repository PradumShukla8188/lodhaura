import { villageInfo } from "@/lib/village-data";
import { cn } from "@/lib/utils";

interface MapEmbedProps {
  className?: string;
  height?: string;
  title?: string;
}

export function MapEmbed({
  className,
  height = "400px",
  title = "Lodhaura Village Location",
}: MapEmbedProps) {
  const { lat, lng } = villageInfo.coordinates;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border/60 shadow-lg", className)}>
      <iframe
        title={title}
        src={src}
        width="100%"
        style={{ height, border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full"
      />
    </div>
  );
}
