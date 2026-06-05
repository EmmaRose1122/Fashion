import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatDate, parseTags } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { TagBadge } from "@/components/ui/TagBadge";

export const revalidate = 0;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = (
    await supabase
      .from("Article")
      .select("*")
      .eq("slug", resolvedParams.slug)
      .eq("category", "fashion")
      .maybeSingle()
  ).data;

  if (!article) return { title: "Not Found" };

  return {
    title: article.title,
    description: article.excerpt || `Read about ${article.title}`,
    alternates: {
      canonical: `${SITE_URL}/fashion/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || "",
      images: article.thumbnail ? [{ url: article.thumbnail }] : [],
    },
  };
}

export default async function FashionArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const article = (
    await supabase
      .from("Article")
      .select("*")
      .eq("slug", resolvedParams.slug)
      .eq("category", "fashion")
      .eq("published", true)
      .maybeSingle()
  ).data;

  if (!article) notFound();

  const parsedTags = parseTags(article.tags);

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": article.thumbnail ? [article.thumbnail] : [],
    "datePublished": new Date(article.createdAt).toISOString(),
    "dateModified": new Date(article.updatedAt).toISOString(),
    "author": [{
      "@type": "Person",
      "name": article.author,
    }],
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    },
    "description": article.excerpt || article.title
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10 text-left">
      {/* Dynamic Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Header */}
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent font-bold">
          <Link href="/fashion" className="hover:underline">Fashion</Link>
          <span className="text-border">•</span>
          <span className="text-text-secondary font-medium">{formatDate(article.createdAt)}</span>
          {article.readTime && (
            <>
              <span className="text-border">•</span>
              <span className="text-text-secondary font-medium">{article.readTime} min read</span>
            </>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-lg text-text-secondary font-medium italic border-l-2 border-accent/30 pl-4 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center space-x-3 pt-2">
          <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center font-heading text-xs font-bold text-accent">
            {article.author.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-xs">
            <p className="font-bold text-text-primary">{article.author}</p>
            <p className="text-text-secondary uppercase tracking-widest text-[9px] font-semibold">Editorial Team</p>
          </div>
        </div>
      </div>

      {/* Featured Thumbnail */}
      {article.thumbnail && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-border-light rounded-sm">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div 
        className="article-content max-w-3xl mx-auto py-4"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {parsedTags.length > 0 && (
        <div className="max-w-3xl mx-auto pt-8 border-t border-border-light flex flex-wrap gap-2">
          {parsedTags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
