import type { MetadataRoute } from "next";
import { SITE_URL, CATEGORIES } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...CATEGORIES.map((cat) => ({
      url: `${SITE_URL}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];

  try {
    const { data: articles } = await supabase
      .from("Article")
      .select("slug, category, updatedAt")
      .eq("published", true);

    const articleUrls: MetadataRoute.Sitemap = (articles || []).map((article) => ({
      url: `${SITE_URL}/${article.category}/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticUrls, ...articleUrls];
  } catch {
    return staticUrls;
  }
}
