"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updateArticle, ArticleActionState } from "@/actions/articles";
import { parseTags } from "@/lib/utils";

interface ArticleFormProps {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    category: string;
    thumbnail: string | null;
    author: string;
    tags: string | null;
    published: boolean;
    featured: boolean;
  };
}

export function ArticleForm({ article }: ArticleFormProps) {
  const updateArticleWithId = updateArticle.bind(null, article.id);
  const [state, action, isPending] = useActionState(updateArticleWithId, undefined);

  const parsedTags = parseTags(article.tags).join(", ");

  return (
    <form action={action} className="space-y-6 text-left">
      {state?.error && (
        <div className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 p-4 rounded-sm">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="title" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Article Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={article.title}
            placeholder="e.g. The Quiet Luxury Era: A Style Guide"
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="excerpt" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Excerpt / Summary
          </label>
          <textarea
            name="excerpt"
            id="excerpt"
            rows={2}
            defaultValue={article.excerpt || ""}
            placeholder="A brief summary of the article..."
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary resize-y"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Category *
          </label>
          <select
            name="category"
            id="category"
            required
            defaultValue={article.category}
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          >
            <option value="fashion">Fashion</option>
            <option value="beauty">Beauty</option>
          </select>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <label htmlFor="author" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Author
          </label>
          <input
            type="text"
            name="author"
            id="author"
            defaultValue={article.author}
            placeholder="Editorial Team"
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Thumbnail Image URL */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="thumbnail" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Thumbnail / Featured Image URL
          </label>
          <input
            type="text"
            name="thumbnail"
            id="thumbnail"
            defaultValue={article.thumbnail || ""}
            placeholder="https://images.unsplash.com/photo-... or /uploads/..."
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="tags" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            defaultValue={parsedTags}
            placeholder="style, trends, skin care, summer"
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        {/* Content */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="content" className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Content (HTML/Markdown Format Supported) *
          </label>
          <textarea
            name="content"
            id="content"
            required
            rows={12}
            defaultValue={article.content}
            placeholder="Write your article body content here..."
            className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary font-mono resize-y"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-8 py-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            id="published"
            defaultChecked={article.published}
            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
          />
          <span className="text-xs uppercase tracking-wider text-text-secondary font-bold select-none">
            Published
          </span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            defaultChecked={article.featured}
            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
          />
          <span className="text-xs uppercase tracking-wider text-text-secondary font-bold select-none">
            Featured on Homepage
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-6 border-t border-border-light">
        <button
          type="submit"
          disabled={isPending}
          className="text-xs uppercase tracking-widest bg-accent hover:bg-accent-hover disabled:bg-text-secondary/40 text-white px-8 py-4 rounded-sm font-semibold transition-colors"
        >
          {isPending ? "Saving Changes..." : "Save Changes"}
        </button>
        <Link
          href="/admin/articles"
          className="text-xs uppercase tracking-widest text-text-secondary hover:text-accent font-medium py-4 px-2 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
