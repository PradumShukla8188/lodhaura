import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { QuickCards } from "@/components/home/QuickCards";

const RecentBlogsSection = dynamic(
  () => import("@/components/home/RecentBlogsSection").then((m) => m.RecentBlogsSection),
  { loading: () => null }
);
const LatestVideosSection = dynamic(
  () => import("@/components/home/LatestVideosSection").then((m) => m.LatestVideosSection),
  { loading: () => null }
);
const LatestImagesSection = dynamic(
  () => import("@/components/home/LatestImagesSection").then((m) => m.LatestImagesSection),
  { loading: () => null }
);
const UpcomingEventsSection = dynamic(
  () => import("@/components/home/UpcomingEventsSection").then((m) => m.UpcomingEventsSection),
  { loading: () => null }
);
const SchemesSection = dynamic(
  () => import("@/components/home/SchemesSection").then((m) => m.SchemesSection),
  { loading: () => null }
);
const DevelopmentProgressSection = dynamic(
  () => import("@/components/home/DevelopmentProgressSection").then((m) => m.DevelopmentProgressSection),
  { loading: () => null }
);
const TestimonialsSection = dynamic(
  () => import("@/components/home/TestimonialsSection").then((m) => m.TestimonialsSection),
  { loading: () => null }
);
const MapSection = dynamic(
  () => import("@/components/home/MapSection").then((m) => m.MapSection),
  { loading: () => null }
);
const NewsletterSection = dynamic(
  () => import("@/components/home/NewsletterSection").then((m) => m.NewsletterSection),
  { loading: () => null }
);

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <QuickCards />
      <RecentBlogsSection />
      <LatestVideosSection />
      <LatestImagesSection />
      <UpcomingEventsSection />
      <SchemesSection />
      <DevelopmentProgressSection />
      <TestimonialsSection />
      <MapSection />
      <NewsletterSection />
    </>
  );
}
