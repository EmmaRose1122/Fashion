import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Pagination } from "@/components/ui/Pagination";
import { ARTICLES_PER_PAGE, CATEGORIES } from "@/lib/constants";

export const revalidate = 0;

interface CategoryPageProps {
  searchParams: Promise<{ page?: string }>;
}

const categoryInfo = CATEGORIES.find((c) => c.slug === "fashion")!;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: categoryInfo.name,
    description: categoryInfo.description,
    alternates: {
      canonical: `/fashion`,
    },
  };
}

export default async function FashionCategoryPage({ searchParams }: CategoryPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  const totalArticles = (
    await supabase
      .from("Article")
      .select("*", { count: "exact", head: true })
      .eq("category", "fashion")
      .eq("published", true)
  ).count || 0;

  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  const from = (currentPage - 1) * ARTICLES_PER_PAGE;
  const to = from + ARTICLES_PER_PAGE - 1;

  const articles = (
    await supabase
      .from("Article")
      .select("*")
      .eq("category", "fashion")
      .eq("published", true)
      .order("createdAt", { ascending: false })
      .range(from, to)
  ).data || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      {/* Category Header */}
      <div className="max-w-3xl space-y-4 border-b border-border-light pb-10 text-left">
        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Category</span>
        <h1 className="text-4xl md:text-5xl font-bold font-heading">{categoryInfo.name}</h1>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          {categoryInfo.description}
        </p>
      </div>

      {/* Grid */}
      {articles.length > 0 ? (
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/fashion"
          />
        </div>
      ) : (
        <div className="py-24 border border-dashed border-border text-center text-text-secondary text-sm">
          No articles found under {categoryInfo.name}.
        </div>
      )}
    </div>
  );
}
