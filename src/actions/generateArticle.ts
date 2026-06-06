"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { slugify, calculateReadTime } from "@/lib/utils";

interface GenerateArticleResult {
    success?: boolean;
    error?: string;
    article?: {
        title: string;
        slug: string;
        category: string;
        excerpt: string | null;
        content: string;
        author: string;
        tags: string;
    };
}

async function callAIProvider(
    provider: string,
    apiKey: string,
    model: string,
    systemPrompt: string,
    userPrompt: string,
    customBaseUrl?: string
): Promise<string> {
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
    ];

    if (provider === "openai") {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || "gpt-4-turbo-preview",
                messages,
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "OpenAI API error");
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "";
    }

    if (provider === "anthropic") {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: model || "claude-3-opus-20240229",
                system: systemPrompt,
                messages: [{ role: "user", content: userPrompt }],
                max_tokens: 4000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Anthropic API error");
        }

        const data = await response.json();
        return data.content[0]?.text || "";
    }

    if (provider === "openrouter") {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
                "HTTP-Referer": "https://fashionworldhub.vercel.app",
                "X-Title": "LUXE Editorial",
            },
            body: JSON.stringify({
                model: model || "openai/gpt-4-turbo",
                messages,
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "OpenRouter API error");
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "";
    }

    if (provider === "custom" && customBaseUrl) {
        const response = await fetch(`${customBaseUrl.replace(/\/$/, "")}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || "default",
                messages,
                temperature: 0.7,
                max_tokens: 4000,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || "Custom API error");
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "";
    }

    throw new Error("Invalid provider");
}

export async function generateArticle(
    prevState: any,
    formData: FormData
): Promise<GenerateArticleResult> {
    const apiKey = (formData.get("apiKey") as string)?.trim();
    const provider = (formData.get("provider") as string)?.trim() || "openai";
    const customBaseUrl = (formData.get("customBaseUrl") as string)?.trim();
    const model = (formData.get("model") as string)?.trim();
    const systemPrompt = (formData.get("systemPrompt") as string)?.trim();
    const prompt = (formData.get("prompt") as string)?.trim();

    if (!apiKey) {
        return { error: "API key is required" };
    }

    if (!prompt) {
        return { error: "Prompt is required" };
    }

    if (provider === "custom" && !customBaseUrl) {
        return { error: "Custom base URL is required for custom provider" };
    }

    try {
        const content = await callAIProvider(
            provider,
            apiKey,
            model,
            systemPrompt,
            prompt,
            customBaseUrl
        );

        if (!content) {
            return { error: "AI returned empty content" };
        }

        // Extract title from content or generate one
        const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/^##\s+(.+)$/m);
        const title = titleMatch?.[1]?.trim() || "Untitled Article";

        // Extract category from prompt or default to fashion
        const categoryMatch = prompt.match(/category[:\s]+(\w+)/i) ||
            prompt.match(/(fashion|beauty|nail-design|home-decor|health|mom-special)/i);
        const category = categoryMatch?.[1]?.toLowerCase() || "fashion";

        // Generate excerpt from first paragraph
        const excerpt = content
            .replace(/^#.*$/gm, "")
            .replace(/^##.*$/gm, "")
            .trim()
            .split("\n")[0]
            ?.slice(0, 300) || null;

        // Generate slug
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

        const tags = JSON.stringify([]);
        const readTime = calculateReadTime(content);

        return {
            success: true,
            article: {
                title,
                slug,
                category,
                excerpt,
                content,
                author: "AI Generated",
                tags,
            },
        };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Failed to generate article" };
    }
}