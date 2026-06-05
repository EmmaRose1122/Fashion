"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify, calculateReadTime } from "@/lib/utils";

export type ArticleActionState = {
  error?: string;
  success?: boolean;
};

export async function createArticle(
  prevState: ArticleActionState | undefined,
  formData: FormData
): Promise<ArticleActionState> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const category = formData.get("category") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const author = formData.get("author") as string || "Editorial Team";
  const tagsInput = formData.get("tags") as string;
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  if (!title || !content || !category) {
    return { error: "Title, Content and Category are required." };
  }

  let baseSlug = slugify(title);
  // Ensure uniqueness of slug
  let slug = baseSlug;
  let count = 1;
  while (true) {
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (!existing) break;
    slug = `${baseSlug}-${count++}`;
  }

  // Parse tags to JSON string array
  const tagsArray = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const tags = JSON.stringify(tagsArray);

  const readTime = calculateReadTime(content);

  try {
    await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        category,
        thumbnail: thumbnail || null,
        author,
        tags,
        published,
        featured,
        readTime,
      },
    });
  } catch (err) {
    console.error("Failed to create article:", err);
    return { error: "Database error. Failed to create article." };
  }

  revalidatePath("/");
  revalidatePath(`/${category}`);
  revalidatePath(`/admin/articles`);
  redirect("/admin/articles");
}

export async function updateArticle(
  id: string,
  prevState: ArticleActionState | undefined,
  formData: FormData
): Promise<ArticleActionState> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const category = formData.get("category") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const author = formData.get("author") as string || "Editorial Team";
  const tagsInput = formData.get("tags") as string;
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  if (!title || !content || !category) {
    return { error: "Title, Content and Category are required." };
  }

  // Get current article to check slug change
  const current = await prisma.article.findUnique({ where: { id } });
  if (!current) {
    return { error: "Article not found." };
  }

  let slug = current.slug;
  if (current.title !== title) {
    let baseSlug = slugify(title);
    slug = baseSlug;
    let count = 1;
    while (true) {
      const existing = await prisma.article.findUnique({ where: { slug } });
      if (!existing || existing.id === id) break;
      slug = `${baseSlug}-${count++}`;
    }
  }

  const tagsArray = tagsInput
    ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const tags = JSON.stringify(tagsArray);

  const readTime = calculateReadTime(content);

  try {
    await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        category,
        thumbnail: thumbnail || null,
        author,
        tags,
        published,
        featured,
        readTime,
      },
    });
  } catch (err) {
    console.error("Failed to update article:", err);
    return { error: "Database error. Failed to update article." };
  }

  revalidatePath("/");
  revalidatePath(`/${category}`);
  revalidatePath(`/${category}/${slug}`);
  revalidatePath(`/admin/articles`);
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  try {
    const article = await prisma.article.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath(`/${article.category}`);
    revalidatePath(`/admin/articles`);
  } catch (err) {
    console.error("Failed to delete article:", err);
    throw new Error("Failed to delete article.");
  }
}
