import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { slugify, calculateReadTime } from "@/lib/utils";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const title = (formData.get("title") as string)?.trim();
        const slug = (formData.get("slug") as string)?.trim();
        const category = (formData.get("category") as string)?.trim();
        const excerpt = (formData.get("excerpt") as string)?.trim();
        const content = (formData.get("content") as string)?.trim();
        const author = (formData.get("author") as string)?.trim() || "Editorial Team";
        const tagsInput = (formData.get("tags") as string)?.trim();
        const published = formData.get("published") === "on";
        const featured = formData.get("featured") === "on";

        if (!title || !content || !category) {
            return NextResponse.json(
                { error: "Title, content, and category are required." },
                { status: 400 }
            );
        }

        let finalSlug = slug || slugify(title);
        if (finalSlug !== slug) {
            let count = 1;
            while (true) {
                const { data: existing } = await supabase
                    .from("Article")
                    .select("id")
                    .eq("slug", finalSlug)
                    .maybeSingle();
                if (!existing) break;
                finalSlug = `${finalSlug}-${count++}`;
            }
        } else {
            // slug provided, check for collision
            let count = 1;
            while (true) {
                const { data: existing } = await supabase
                    .from("Article")
                    .select("id")
                    .eq("slug", finalSlug)
                    .maybeSingle();
                if (!existing) break;
                finalSlug = `${slug}-${count++}`;
            }
        }

        const tags = JSON.stringify(
            tagsInput ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean) : []
        );
        const readTime = calculateReadTime(content);

        const { error } = await supabase.from("Article").insert({
            title,
            slug: finalSlug,
            content,
            excerpt: excerpt || null,
            category,
            author,
            tags,
            published,
            featured,
            readTime,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to save article" },
            { status: 500 }
        );
    }
}