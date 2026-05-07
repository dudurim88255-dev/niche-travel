import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";
import { DESTINATIONS } from "@/data/destinations";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://niche-travel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await getAllSlugs();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/map`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE}/schedule`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Phase 8: /places/{slug} 30개 — verifiedDate가 있으면 lastModified로 사용
  const placePages: MetadataRoute.Sitemap = DESTINATIONS.map((d) => ({
    url: `${BASE}/places/${d.slug}`,
    lastModified: d.sources?.verifiedDate
      ? new Date(d.sources.verifiedDate)
      : now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...placePages];
}
