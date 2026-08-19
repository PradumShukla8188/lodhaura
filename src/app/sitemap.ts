import type { MetadataRoute } from "next";
import { blogs } from "@/lib/village-data";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lodhaura-village.vercel.app";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/gallery",
  "/videos",
  "/blogs",
  "/events",
  "/news",
  "/development-projects",
  "/government-schemes",
  "/panchayat",
  "/contact",
  "/donation",
  "/temple",
  "/school",
  "/login",
  "/signup",
  "/privacy",
  "/terms",
  "/search",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...blogPages];
}
