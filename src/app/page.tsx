import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Marquee } from "@/components/ui/Marquee";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TextReveal } from "@/components/ui/TextReveal";
import { formatDate } from "@/lib/utils";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export const revalidate = 0;

export default async function HomePage() {
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
    <div className="pb-24">
      {/* ============================================
          HERO
          ============================================ */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="max-w-7xl mx-auto px-6 pt-20 md:pt-32 pb-20 md:pb-28 text-center">
          <div
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-10 animate-fade-down"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="inline-block w-6 h-px bg-accent" />
            <span>Issue No. 01 · Spring 2026</span>
            <span className="inline-block w-6 h-px bg-accent" />
          </div>

          <TextReveal
            as="h1"
            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold leading-[0.95] tracking-[-0.03em] max-w-5xl mx-auto"
            duration={1200}
            delay={120}
          >
            The quiet art of{" "}
            <span className="font-display italic font-normal text-accent">looking</span>{" "}
            good.
          </TextReveal>

          <TextReveal
            as="p"
            className="text-base md:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto mt-10"
            delay={400}
            duration={900}
          >
            An editorial journal of fashion, beauty, wellness, and home —
            for the modern woman who chooses substance over spectacle.
          </TextReveal>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-12"
            style={{ animation: "fade-up 1s cubic-bezier(0.22,1,0.36,1) 0.7s both" }}
          >
            <Link
              href="/fashion"
              className="text-xs uppercase tracking-[0.2em] bg-text-primary hover:bg-accent text-white px-10 py-5 font-semibold transition-colors"
            >
              Read the Journal
            </Link>
            <Link
              href="#latest"
              className="gold-underline text-xs uppercase tracking-[0.2em] text-text-primary hover:text-accent font-semibold pb-1 transition-colors"
            >
              Latest Stories
            </Link>
          </div>

          <div
            className="grid grid-cols-3 gap-4 md:gap-16 pt-20 max-w-3xl mx-auto border-t border-border mt-20"
            style={{ animation: "fade-up 1s cubic-bezier(0.22,1,0.36,1) 1s both" }}
          >
            {[
              { num: "6", label: "Sections" },
              { num: "∞", label: "Curated Stories" },
              { num: "Wk", label: "New Issues" },
            ].map((s) => (
              <div key={s.label} className="text-center space-y-1">
                <p className="font-display text-4xl md:text-6xl italic text-text-primary">
                  {s.num}
                </p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary font-semibold">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          MARQUEE
          ============================================ */}
      <section className="py-10 border-b border-border bg-surface overflow-hidden">
        <Marquee speed="slow" className="py-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex items-center gap-4 text-2xl md:text-3xl font-display italic text-text-primary/40 hover:text-accent transition-colors duration-500"
            >
              <span className="tracking-tight">{cat.name}</span>
              <span className="text-accent/60 mx-3">✦</span>
            </Link>
          ))}
        </Marquee>
      </section>

      {/* ============================================
          FEATURED
          ============================================ */}
      {featuredArticle && (
        <AnimatedSection className="max-w-7xl mx-auto px-6 pt-24 md:pt-32" threshold={0.05}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-7 group">
              <Link
                href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                className="block relative aspect-[4/5] overflow-hidden bg-border-light"
              >
                {featuredArticle.thumbnail ? (
                  <Image
                    src={featuredArticle.thumbnail}
                    alt={featuredArticle.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-border-light text-text-secondary text-sm uppercase tracking-widest">
                    {featuredArticle.category}
                  </div>
                )}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-1.5 bg-accent text-white text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 font-bold">
                    Featured
                  </span>
                </div>
              </Link>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-accent font-bold">
                <span className="capitalize">{featuredArticle.category.replace("-", " ")}</span>
                <span className="text-border">·</span>
                <span className="text-text-secondary font-medium">{formatDate(featuredArticle.createdAt)}</span>
              </div>

              <div className="space-y-5">
                <Link
                  href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                  className="block group"
                >
                  <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] transition-colors duration-300 group-hover:text-accent">
                    {featuredArticle.title}
                  </h2>
                </Link>
                {featuredArticle.excerpt && (
                  <p className="font-display italic text-lg md:text-xl text-text-secondary leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                  className="gold-underline text-xs uppercase tracking-[0.2em] text-text-primary hover:text-accent font-bold pb-1 transition-colors"
                >
                  Read the Story →
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ============================================
          CATEGORIES
          ============================================ */}
      <section className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6 text-left">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
              Sections
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-[-0.02em]">
              Browse by Section
            </h2>
          </div>
          <p className="text-sm text-text-secondary max-w-sm font-display italic">
            Six curated spaces — each crafted with intention.
          </p>
        </div>

        <AnimatedSection className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" stagger={80}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="hover-lift group relative overflow-hidden bg-surface border border-border hover:border-accent transition-all p-6 flex flex-col items-start justify-between min-h-[180px]"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent/70 group-hover:text-accent font-bold">
                Section
              </span>
              <div className="space-y-1">
                <h3 className="font-heading text-lg md:text-xl font-semibold group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-text-secondary/60 font-medium uppercase tracking-[0.2em]">
                  {categoryArticles[cat.slug]?.length || 0} {categoryArticles[cat.slug]?.length === 1 ? "story" : "stories"} →
                </span>
              </div>
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                aria-hidden="true"
              />
            </Link>
          ))}
        </AnimatedSection>
      </section>

      {/* ============================================
          LATEST STORIES
          ============================================ */}
      <section id="latest" className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 space-y-12 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6 text-left">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
              The Journal
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-[-0.02em]">
              Latest Stories
            </h2>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {CATEGORIES.slice(0, 3).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="gold-underline text-[11px] uppercase tracking-[0.2em] text-text-secondary hover:text-accent font-semibold transition-colors"
              >
                {cat.name} →
              </Link>
            ))}
          </div>
        </div>

        {latestArticles.length > 0 ? (
          <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16" stagger={100}>
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </AnimatedSection>
        ) : (
          <div className="py-24 border border-dashed border-border text-center text-text-secondary text-sm">
            <p className="font-display italic text-base mb-2">No stories yet.</p>
            <p>The journal is being prepared. Check back soon.</p>
          </div>
        )}
      </section>

      {/* ============================================
          MANIFESTO
          ============================================ */}
      <section className="max-w-4xl mx-auto px-6 pt-32 md:pt-40 text-center space-y-8">
        <div className="inline-block w-12 h-px bg-accent" />
        <TextReveal
          as="h2"
          className="font-display italic text-4xl md:text-6xl lg:text-7xl leading-[1.05] shimmer-text"
        >
          Style is a quiet language.
        </TextReveal>
        <TextReveal
          as="p"
          delay={200}
          className="text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto font-display italic"
        >
          At {SITE_NAME}, we believe in the slow craft of looking good. No noise. No trends
          for the sake of trends. Just considered stories, beautiful writing, and a
          community of women who choose substance over spectacle.
        </TextReveal>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.4em] text-text-secondary font-semibold">
          <span>Est. 2026</span>
          <span className="text-accent">✦</span>
          <span>Quiet Luxury</span>
          <span className="text-accent">✦</span>
          <span>Curated Editorial</span>
        </div>
      </section>
    </div>
  );
}
