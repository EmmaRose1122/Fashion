import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/fashion`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/beauty`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    // Dynamic import so the module isn't evaluated at build time when env vars may be absent
    const { supabase } = await import("@/lib/supabase");

    const [articlesRes, jobsRes] = await Promise.all([
      supabase
        .from("Article")
        .select("slug, category, updatedAt")
        .eq("published", true),
      supabase
        .from("Job")
        .select("id, updatedAt")
        .eq("active", true),
    ]);

    const articles = articlesRes.data || [];
    const jobs = jobsRes.data || [];

    const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${SITE_URL}/${article.category}/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const jobUrls: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${SITE_URL}/jobs/${job.id}`,
      lastModified: job.updatedAt,
      changeFrequency: "daily",
      priority: 0.9,
    }));

    return [...staticUrls, ...articleUrls, ...jobUrls];
  } catch {
    // During build or when Supabase isn't configured, return only static URLs
    return staticUrls;
  }
}
