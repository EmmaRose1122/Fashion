import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { JobCard } from "@/components/ui/JobCard";
import { formatDate } from "@/lib/utils";

// Make the page dynamic so it fetches fresh DB content
export const revalidate = 0;

export default async function HomePage() {
  // Fetch featured article
  const featuredArticle = await prisma.article.findFirst({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
  }) || await prisma.article.findFirst({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  // Fetch latest articles (excluding the featured one if it exists)
  const latestArticles = await prisma.article.findMany({
    where: {
      published: true,
      id: featuredArticle ? { not: featuredArticle.id } : undefined,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // Fetch featured jobs
  const featuredJobs = await prisma.job.findMany({
    where: { active: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-24 pb-24">
      {/* Editorial Hero Section */}
      {featuredArticle && (
        <section className="max-w-7xl mx-auto px-6 pt-8 md:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Image */}
            <div className="lg:col-span-7">
              <Link href={`/${featuredArticle.category}/${featuredArticle.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-border-light rounded-sm">
                {featuredArticle.thumbnail ? (
                  <Image
                    src={featuredArticle.thumbnail}
                    alt={featuredArticle.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-border-light text-text-secondary text-sm uppercase tracking-widest">
                    {featuredArticle.category}
                  </div>
                )}
              </Link>
            </div>

            {/* Content info */}
            <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent font-bold">
                <span>Featured</span>
                <span className="text-border">•</span>
                <span className="text-text-secondary font-medium">{featuredArticle.category}</span>
                <span className="text-border">•</span>
                <span className="text-text-secondary font-medium">{formatDate(featuredArticle.createdAt)}</span>
              </div>

              <div className="space-y-4">
                <Link href={`/${featuredArticle.category}/${featuredArticle.slug}`} className="hover:text-accent transition-colors">
                  <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    {featuredArticle.title}
                  </h1>
                </Link>
                {featuredArticle.excerpt && (
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                  className="text-xs uppercase tracking-widest text-text-primary hover:text-accent font-bold border-b border-text-primary hover:border-accent pb-1 transition-all"
                >
                  Read Editorial
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-light pb-6 text-left">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold">The Journal</span>
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Latest Stories</h2>
          </div>
          <div className="flex space-x-4">
            <Link href="/fashion" className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent transition-colors">
              Fashion →
            </Link>
            <Link href="/beauty" className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent transition-colors">
              Beauty →
            </Link>
          </div>
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-border text-center text-text-secondary text-sm">
            No articles found. Check back later or add content via the admin dashboard.
          </div>
        )}
      </section>

      {/* Careers / Job Board Highlight */}
      <section className="bg-surface border-y border-border py-24">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Opportunities</span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading">Curated Career Board</h2>
            <p className="text-sm text-text-secondary max-w-lg mx-auto">
              Discover select vacancies in leading fashion houses, beauty brands, and premium design agencies.
            </p>
          </div>

          <div className="space-y-4 text-left">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="py-12 border border-dashed border-border text-center text-text-secondary text-sm bg-background">
                No featured jobs currently listed.
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/jobs"
              className="inline-block text-xs uppercase tracking-widest bg-text-primary hover:bg-accent text-white px-8 py-4 rounded-sm font-semibold transition-colors"
            >
              Explore Job Board
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
