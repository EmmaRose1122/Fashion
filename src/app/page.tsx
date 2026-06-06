import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { formatDate } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

// Make the page dynamic so it fetches fresh DB content
export const revalidate = 0;

export default async function HomePage() {
  // Fetch featured article
  let featuredArticle = (
    await supabase
      .from("Article")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("createdAt", { ascending: false })
      .limit(1)
      .maybeSingle()
  ).data;

  if (!featuredArticle) {
    featuredArticle = (
      await supabase
        .from("Article")
        .select("*")
        .eq("published", true)
        .order("createdAt", { ascending: false })
        .limit(1)
        .maybeSingle()
    ).data;
  }

  // Fetch latest articles (excluding the featured one if it exists)
  let latestArticlesQuery = supabase
    .from("Article")
    .select("*")
    .eq("published", true)
    .order("createdAt", { ascending: false })
    .limit(6);

  if (featuredArticle) {
    latestArticlesQuery = latestArticlesQuery.neq("id", featuredArticle.id);
  }

  const latestArticles = (await latestArticlesQuery).data || [];

  // Fetch articles per category for the category showcase
  const categoryArticles: Record<string, any[]> = {};
  for (const cat of CATEGORIES) {
    const data = (
      await supabase
        .from("Article")
        .select("*")
        .eq("category", cat.slug)
        .eq("published", true)
        .order("createdAt", { ascending: false })
        .limit(3)
    ).data || [];
    categoryArticles[cat.slug] = data;
  }

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
                <span className="text-text-secondary font-medium capitalize">{featuredArticle.category.replace("-", " ")}</span>
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

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-light pb-6 text-left">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Explore</span>
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Browse by Category</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group relative overflow-hidden bg-surface border border-border hover:border-accent transition-all rounded-sm p-6 flex flex-col items-start justify-between min-h-[140px]"
            >
              <span className="text-[10px] uppercase tracking-widest text-accent font-bold">
                Category
              </span>
              <div className="space-y-1">
                <h3 className="font-heading text-base md:text-lg font-bold group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-text-secondary/60 font-medium">
                  {categoryArticles[cat.slug]?.length || 0} stories →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-light pb-6 text-left">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold">The Journal</span>
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Latest Stories</h2>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {CATEGORIES.slice(0, 3).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
              >
                {cat.name} →
              </Link>
            ))}
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

      {/* Category Highlights */}
      {CATEGORIES.filter((c) => categoryArticles[c.slug]?.length > 0).slice(0, 2).map((cat) => (
        <section key={cat.slug} className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-light pb-6 text-left">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Featured</span>
              <h2 className="text-2xl md:text-3xl font-bold font-heading">{cat.name} Highlights</h2>
            </div>
            <Link
              href={`/${cat.slug}`}
              className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
            >
              View All {cat.name} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
            {categoryArticles[cat.slug].slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
