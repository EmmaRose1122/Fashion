"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabase, supabase } from "@/lib/supabase";
import { slugify, calculateReadTime } from "@/lib/utils";

export type ArticleActionState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>;
};

const STORAGE_BUCKET = "article-thumbnails";

/**
 * Upload a thumbnail image to Supabase Storage and return its public URL.
 * If no file is provided (or upload fails), returns the original URL string.
 */
async function uploadThumbnail(file: File | null, existingUrl: string | null): Promise<string | null> {
  const fallback = existingUrl && existingUrl.trim() ? existingUrl : null;
  if (!file || file.size === 0) return fallback;

  // Validate file type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (!allowed.includes(file.type)) {
    throw new Error(`Unsupported image type: ${file.type}. Use JPG, PNG, WebP, GIF, or AVIF.`);
  }

  // 5MB cap
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image is too large. Maximum size is 5MB.");
  }

  const client = getSupabase();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = `thumbnails/${safeName}`;

  const { error: uploadError } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = client.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

export async function createArticle(
  prevState: ArticleActionState | undefined,
  formData: FormData
): Promise<ArticleActionState> {
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const thumbnailUrl = (formData.get("thumbnail") as string)?.trim() || null;
  const author = (formData.get("author") as string)?.trim() || "Editorial Team";
  const tagsInput = (formData.get("tags") as string)?.trim();
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const thumbnailFile = formData.get("thumbnailFile") as File | null;

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Title is required.";
  if (!content) fieldErrors.content = "Content is required.";
  if (!category) fieldErrors.category = "Category is required.";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  let finalThumbnail: string | null = null;
  try {
    finalThumbnail = await uploadThumbnail(thumbnailFile, thumbnailUrl);
  } catch (uploadErr: any) {
    console.error("Thumbnail upload error:", uploadErr);
    return { error: uploadErr?.message || "Failed to upload image." };
  }

  let baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;
  try {
    while (true) {
      const { data: existing, error: slugErr } = await supabase
        .from("Article")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (slugErr) throw slugErr;
      if (!existing) break;
      slug = `${baseSlug}-${count++}`;
    }
  } catch (slugErr: any) {
    console.error("Slug check failed:", slugErr);
    return { error: `Could not generate a unique slug: ${slugErr?.message || "unknown error"}` };
  }

  const tagsArray = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const tags = JSON.stringify(tagsArray);

  const readTime = calculateReadTime(content);

  try {
    const { error } = await supabase.from("Article").insert({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      category,
      thumbnail: finalThumbnail,
      author,
      tags,
      published,
      featured,
      readTime,
    });
    if (error) throw error;
  } catch (err: any) {
    console.error("Failed to create article:", err);
    const message = err?.message || err?.hint || err?.details || "Database error. Failed to create article.";
    return { error: `Database error: ${message}` };
  }

  revalidatePath("/");
  revalidatePath("/" + category);
  revalidatePath("/admin/articles");

  redirect("/admin/articles");
}

export async function updateArticle(
  id: string,
  prevState: ArticleActionState | undefined,
  formData: FormData
): Promise<ArticleActionState> {
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const thumbnailUrl = (formData.get("thumbnail") as string)?.trim() || null;
  const author = (formData.get("author") as string)?.trim() || "Editorial Team";
  const tagsInput = (formData.get("tags") as string)?.trim();
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";
  const thumbnailFile = formData.get("thumbnailFile") as File | null;

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Title is required.";
  if (!content) fieldErrors.content = "Content is required.";
  if (!category) fieldErrors.category = "Category is required.";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const { data: current } = await supabase
    .from("Article")
    .select("slug, title, thumbnail")
    .eq("id", id)
    .maybeSingle();
  if (!current) {
    return { error: "Article not found." };
  }

  let slug = current.slug;
  if (current.title !== title) {
    let baseSlug = slugify(title);
    slug = baseSlug;
    let count = 1;
    try {
      while (true) {
        const { data: existing, error: slugErr } = await supabase
          .from("Article")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (slugErr) throw slugErr;
        if (!existing || existing.id === id) break;
        slug = baseSlug + "-" + count++;
      }
    } catch (slugErr: any) {
      return { error: "Could not generate a unique slug: " + (slugErr?.message || "unknown error") };
    }
  }

  let finalThumbnail: string | null = current.thumbnail;
  try {
    if (thumbnailFile && thumbnailFile.size > 0) {
      finalThumbnail = await uploadThumbnail(thumbnailFile, null);
    } else if (thumbnailUrl) {
      finalThumbnail = thumbnailUrl;
    }
  } catch (uploadErr: any) {
    return { error: uploadErr?.message || "Failed to upload image." };
  }

  const tagsArray = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const tags = JSON.stringify(tagsArray);
  const readTime = calculateReadTime(content);

  try {
    const { error } = await supabase
      .from("Article")
      .update({
        title,
        slug,
        content,
        excerpt: excerpt || null,
        category,
        thumbnail: finalThumbnail,
        author,
        tags,
        published,
        featured,
        readTime,
      })
      .eq("id", id);
    if (error) throw error;
  } catch (err: any) {
    const message = err?.message || err?.hint || err?.details || "Database error. Failed to update article.";
    return { error: "Database error: " + message };
  }

  revalidatePath("/");
  revalidatePath("/" + category);
  revalidatePath("/" + category + "/" + slug);
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  try {
    const { data: article, error } = await supabase
      .from("Article")
      .delete()
      .eq("id", id)
      .select("category")
      .single();
    if (error) throw error;
    revalidatePath("/");
    if (article && article.category) {
      revalidatePath("/" + article.category);
    }
    revalidatePath("/admin/articles");
  } catch (err) {
    console.error("Failed to delete article:", err);
    throw new Error("Failed to delete article.");
  }
}
