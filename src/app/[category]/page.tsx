import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Pagination } from "@/components/ui/Pagination";
import { ARTICLES_PER_PAGE, CATEGORIES, CATEGORY_SLUGS } from "@/lib/constants";

export const revalidate = 0;

interface CategoryPageProps {
    params: Promise<{ category: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
    return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await params;
    if (!CATEGORY_SLUGS.includes(category)) {
        return { title: "Not Found" };
    }
    const categoryInfo = CATEGORIES.find((c) => c.slug === category)!;
    return {
        title: categoryInfo.name,
        description: categoryInfo.description,
        alternates: {
            canonical: `/${category}`,
        },
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { category } = await params;
    const resolvedSearchParams = await searchParams;

    // Only handle known article categories
    if (!CATEGORY_SLUGS.includes(category)) {
        notFound();
    }

    const categoryInfo = CATEGORIES.find((c) => c.slug === category)!;
    const currentPage = Number(resolvedSearchParams.page) || 1;

    const totalArticles = (
        await supabase
            .from("Article")
            .select("*", { count: "exact", head: true })
            .eq("category", category)
            .eq("published", true)
    ).count || 0;

    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

    const from = (currentPage - 1) * ARTICLES_PER_PAGE;
    const to = from + ARTICLES_PER_PAGE - 1;

    const articles = (
        await supabase
            .from("Article")
            .select("*")
            .eq("category", category)
            .eq("published", true)
            .order("createdAt", { ascending: false })
            .range(from, to)
    ).data || [];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
            {/* Category Hero Header */}
            <div className="max-w-3xl space-y-5 border-b border-border-light pb-10 text-left">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent font-bold">
                    <span>The Journal</span>
                    <span className="text-border">•</span>
                    <span className="text-text-secondary font-medium">Category</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight tracking-tight">
                    {categoryInfo.name}
                </h1>
                <p className="text-sm md:text-lg text-text-secondary leading-relaxed max-w-2xl">
                    {categoryInfo.description}
                </p>
                <div className="flex items-center space-x-3 text-xs text-text-secondary/70 font-medium pt-2">
                    <span>{totalArticles} {totalArticles === 1 ? 'Article' : 'Articles'}</span>
                    <span className="text-border">•</span>
                    <span>Updated regularly</span>
                </div>
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
                        basePath={`/${category}`}
                    />
                </div>
            ) : (
                <div className="py-24 border border-dashed border-border text-center text-text-secondary text-sm rounded-sm">
                    <p className="text-base mb-2">No stories published in {categoryInfo.name} yet.</p>
                    <p className="text-xs text-text-secondary/60">Check back soon for new editorial content.</p>
                </div>
            )}
        </div>
    );
}
