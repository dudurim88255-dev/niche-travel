import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://niche-travel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();
  const now = new Date();

  return [
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
    ...slugs.map((slug) => ({
      url: `${BASE}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
