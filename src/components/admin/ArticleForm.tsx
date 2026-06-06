"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { updateArticle, ArticleActionState } from "@/actions/articles";
import { parseTags } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(article.thumbnail || null);

  const parsedTags = parseTags(article.tags).join(", ");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(article.thumbnail || null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <form action={action} className="space-y-6 text-left" encType="multipart/form-data">
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
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
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

        {/* Thumbnail Image Upload */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-[10px] uppercase tracking-wider text-text-secondary font-bold">
            Thumbnail / Featured Image
          </label>

          {/* Preview */}
          {previewUrl && (
            <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden bg-border-light rounded-sm border border-border">
              <Image
                src={previewUrl}
                alt="Thumbnail preview"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          {/* File Upload */}
          <div className="space-y-2">
            <label htmlFor="thumbnailFile" className="block text-[10px] uppercase tracking-wider text-text-secondary font-semibold">
              Upload New Image
            </label>
            <input
              type="file"
              name="thumbnailFile"
              id="thumbnailFile"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={handleFileChange}
              className="w-full text-xs text-text-secondary file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-widest file:font-semibold file:bg-accent file:text-white file:cursor-pointer hover:file:bg-accent-hover file:rounded-sm cursor-pointer border border-border bg-surface rounded-sm"
            />
            <p className="text-[10px] text-text-secondary/60">
              JPG, PNG, WebP, GIF, or AVIF. Maximum 5MB. Recommended size: 1200x675px.
            </p>
          </div>

          {/* OR — Image URL */}
          <div className="space-y-2 pt-3 border-t border-border-light">
            <label htmlFor="thumbnail" className="block text-[10px] uppercase tracking-wider text-text-secondary font-semibold">
              Or Use External Image URL
            </label>
            <input
              type="text"
              name="thumbnail"
              id="thumbnail"
              defaultValue={article.thumbnail || ""}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-sm border border-border bg-surface px-4 py-3 rounded-sm focus:outline-none focus:border-accent text-text-primary"
            />
            <p className="text-[10px] text-text-secondary/60">
              Use an external image URL if you prefer not to upload. This will only be used when no file is uploaded.
            </p>
          </div>
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
