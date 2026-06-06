import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Marquee } from "@/components/ui/Marquee";
import { CrownIcon } from "@/components/ui/CrownIcon";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { TextReveal } from "@/components/ui/TextReveal";
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

  // Latest articles
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

  // Articles per category
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
          HERO — Editorial masthead
          ============================================ */}
      <section className="relative overflow-hidden border-b border-border-light">
        {/* Decorative gold gradient blob */}
        <div
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-30 blur-3xl pointer-events-none animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(201,169,110,0.45) 0%, rgba(201,169,110,0) 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl pointer-events-none animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(184,150,62,0.4) 0%, rgba(184,150,62,0) 70%)",
            animationDelay: "2s",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-16 md:pb-20">
          {/* Top tagline */}
          <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.4em] text-accent font-bold mb-8 animate-fade-down">
            <span className="inline-block w-8 h-px bg-accent/60" />
            <CrownIcon size={14} className="text-accent" />
            <span>Issue No. 01 · 2026</span>
            <CrownIcon size={14} className="text-accent" />
            <span className="inline-block w-8 h-px bg-accent/60" />
          </div>

          {/* Headline */}
          <TextReveal
            as="h1"
            className="text-center font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight max-w-5xl mx-auto"
            duration={1100}
            delay={120}
          >
            Quiet stories.{" "}
            <span className="italic font-medium text-accent">Quietly</span> luxurious.
          </TextReveal>

          {/* Subtitle */}
          <TextReveal
            as="p"
            className="text-center text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto mt-8"
            delay={320}
            duration={900}
          >
            An editorial journal of fashion, beauty, lifestyle, and curated careers
            for the modern woman &mdash; written slowly, read deliberately.
          </TextReveal>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10"
            style={{ animation: "fade-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.6s both" }}
          >
            <Link
              href="/fashion"
              className="group inline-flex items-center gap-3 text-xs uppercase tracking-widest bg-text-primary hover:bg-accent text-white px-8 py-4 rounded-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-accent/20"
            >
              <CrownIcon size={14} className="text-accent group-hover:text-white transition-colors" />
              Read Latest Issue
            </Link>
            <Link
              href="/jobs"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-text-primary border-b-2 border-accent pb-1 font-semibold transition-all hover:text-accent"
            >
              Explore Careers
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 gap-4 md:gap-12 pt-16 max-w-3xl mx-auto border-t border-border-light mt-16"
            style={{ animation: "fade-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.9s both" }}
          >
            {[
              { num: "6", label: "Editorial Sections" },
              { num: "100+", label: "Curated Stories" },
              { num: "Weekly", label: "New Features" },
            ].map((s) => (
              <div key={s.label} className="text-center space-y-1">
                <p className="font-heading text-3xl md:text-5xl font-bold text-text-primary">
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
          MARQUEE — Category ribbon
          ============================================ */}
      <section className="py-8 border-b border-border-light bg-background overflow-hidden">
        <Marquee speed="slow" className="py-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex items-center gap-3 text-2xl md:text-3xl font-heading font-bold text-text-primary/30 hover:text-accent transition-colors duration-500"
            >
              <CrownIcon size={18} className="text-accent opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="tracking-tight">{cat.name}</span>
              <span className="text-accent/50 mx-2">✦</span>
            </Link>
          ))}
        </Marquee>
      </section>

      {/* ============================================
          FEATURED — Hero editorial article
          ============================================ */}
      {featuredArticle && (
        <AnimatedSection className="max-w-7xl mx-auto px-6 pt-20 md:pt-28" threshold={0.05}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-7 group">
              <Link
                href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                className="block relative aspect-[16/10] overflow-hidden bg-border-light rounded-sm"
              >
                {featuredArticle.thumbnail ? (
                  <Image
                    src={featuredArticle.thumbnail}
                    alt={featuredArticle.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-border-light text-text-secondary text-sm uppercase tracking-widest">
                    {featuredArticle.category}
                  </div>
                )}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-accent text-white text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-sm font-bold">
                  <CrownIcon size={10} className="text-white" />
                  Featured
                </div>
              </Link>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent font-bold">
                <span className="capitalize">{featuredArticle.category.replace("-", " ")}</span>
                <span className="text-border">•</span>
                <span className="text-text-secondary font-medium">{formatDate(featuredArticle.createdAt)}</span>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                  className="block group"
                >
                  <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight transition-colors duration-300 group-hover:text-accent">
                    {featuredArticle.title}
                  </h2>
                </Link>
                {featuredArticle.excerpt && (
                  <p className="text-base text-text-secondary leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                  className="gold-underline text-xs uppercase tracking-widest text-text-primary hover:text-accent font-bold pb-1 transition-colors"
                >
                  Read Editorial →
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ============================================
          CATEGORIES — Browse by section
          ============================================ */}
      <section className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-light pb-6 text-left">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Explore</span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
              Browse by Section
            </h2>
          </div>
          <p className="text-xs text-text-secondary max-w-md">
            Six curated editorial spaces &mdash; each crafted with intention, designed to inspire.
          </p>
        </div>

        <AnimatedSection className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" stagger={80}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="hover-lift group relative overflow-hidden bg-surface border border-border hover:border-accent transition-all rounded-sm p-6 flex flex-col items-start justify-between min-h-[170px]"
            >
              <CrownIcon size={18} className="text-accent opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500" />
              <div className="space-y-1">
                <h3 className="font-heading text-lg md:text-xl font-bold group-hover:text-accent transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-text-secondary/60 font-medium uppercase tracking-widest">
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
      <section className="max-w-7xl mx-auto px-6 pt-24 md:pt-32 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-light pb-6 text-left">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">The Journal</span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
              Latest Stories
            </h2>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {CATEGORIES.slice(0, 3).map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent gold-underline transition-colors font-semibold"
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
            No articles found. Check back later or add content via the admin dashboard.
          </div>
        )}
      </section>

      {/* ============================================
          EDITORIAL PROMISE — Manifesto
          ============================================ */}
      <section className="max-w-5xl mx-auto px-6 pt-24 md:pt-32 text-center space-y-8">
        <CrownIcon size={36} className="text-accent mx-auto animate-float" />
        <TextReveal
          as="h2"
          className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight shimmer-text"
        >
          Style is a quiet language.
        </TextReveal>
        <TextReveal
          as="p"
          delay={200}
          className="text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
        >
          At Fashion Hub, we believe in the slow craft of looking good. No noise. No trends for the sake of trends.
          Just considered stories, beautiful writing, and a community of women who choose substance over spectacle.
        </TextReveal>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-text-secondary font-semibold">
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
