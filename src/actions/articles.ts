"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { slugify, calculateReadTime } from "@/lib/utils";

/**
 * Create a new article.
 * (Admin functionality — requires elevated access via Supabase RLS / service role.)
 */
export async function createArticle(
  prevState: any,
  formData: FormData
) {
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || "Editorial Team";
  const tagsInput = (formData.get("tags") as string)?.trim();
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  if (!title || !content || !category) {
    return { error: "Title, content, and category are required." };
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;
  while (true) {
    const { data: existing } = await supabase
      .from("Article")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${count++}`;
  }

  const tags = JSON.stringify(
    tagsInput ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean) : []
  );
  const readTime = calculateReadTime(content);

  const { error } = await supabase.from("Article").insert({
    title,
    slug,
    content,
    excerpt: excerpt || null,
    category,
    author,
    tags,
    published,
    featured,
    readTime,
  });
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/" + category);
  return { success: true };
}
