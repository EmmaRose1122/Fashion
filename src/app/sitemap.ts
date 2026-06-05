import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all published articles
  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, category: true, updatedAt: true },
  });

  // Fetch all active jobs
  const jobs = await prisma.job.findMany({
    where: { active: true },
    select: { id: true, updatedAt: true },
  });

  const articleUrls = articles.map((article) => ({
    url: `${SITE_URL}/${article.category}/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const jobUrls = jobs.map((job) => ({
    url: `${SITE_URL}/jobs/${job.id}`,
    lastModified: job.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const staticUrls = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/fashion`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/beauty`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  return [...staticUrls, ...articleUrls, ...jobUrls];
}
