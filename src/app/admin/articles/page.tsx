import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { deleteArticle } from "@/actions/articles";

export const revalidate = 0;

export default async function AdminArticlesListPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-light pb-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Console</span>
          <h1 className="font-heading text-2xl md:text-3xl font-bold">Manage Articles</h1>
        </div>
        <Link
          href="/admin/articles/new"
          className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-sm font-semibold transition-colors self-start"
        >
          New Article
        </Link>
      </div>

      {/* Table */}
      {articles.length > 0 ? (
        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-background/40 transition-colors">
                    <td className="px-6 py-4 font-medium max-w-xs truncate">{article.title}</td>
                    <td className="px-6 py-4 capitalize text-xs">{article.category}</td>
                    <td className="px-6 py-4">
                      {article.published ? (
                        <span className="inline-block text-[9px] uppercase tracking-wider bg-green-50 text-green-700 border border-green-150 px-2 py-0.5 rounded-sm font-semibold">
                          Published
                        </span>
                      ) : (
                        <span className="inline-block text-[9px] uppercase tracking-wider bg-yellow-50 text-yellow-700 border border-yellow-150 px-2 py-0.5 rounded-sm font-semibold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {article.featured ? (
                        <span className="text-accent text-xs">★ Yes</span>
                      ) : (
                        <span className="text-text-secondary/40 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">{formatDate(article.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-4">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="text-xs text-text-secondary hover:text-accent font-medium"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteArticle(article.id);
                          }}
                          className="inline"
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-500 hover:text-red-700 font-bold"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-24 border border-dashed border-border text-center text-text-secondary text-sm rounded-sm">
          No articles written yet. Click &quot;New Article&quot; to write your first story.
        </div>
      )}
    </div>
  );
}
