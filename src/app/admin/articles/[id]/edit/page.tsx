import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const revalidate = 0;

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!article) notFound();

  return (
    <div className="space-y-8 text-left max-w-3xl">
      {/* Header */}
      <div className="border-b border-border-light pb-6 space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Console</span>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Edit Article</h1>
        <p className="text-xs text-text-secondary">Modify article details, category, or status.</p>
      </div>

      <ArticleForm article={article} />
    </div>
  );
}
