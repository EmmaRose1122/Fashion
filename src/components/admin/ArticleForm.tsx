"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { generateArticle } from "@/actions/generateArticle";

interface ArticleFormState {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    author: string;
    tags: string;
    featured: boolean;
    published: boolean;
}

export function ArticleForm() {
    const [activeTab, setActiveTab] = useState<"ai" | "manual">("ai");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // AI Generation state
    const [apiKey, setApiKey] = useState("");
    const [provider, setProvider] = useState<"openai" | "anthropic" | "openrouter" | "custom">("openai");
    const [customBaseUrl, setCustomBaseUrl] = useState("");
    const [model, setModel] = useState("");
    const [prompt, setPrompt] = useState("");
    const [systemPrompt, setSystemPrompt] = useState(
        `You are an expert editorial writer for LUXE, a high-end fashion and lifestyle journal. 
Write sophisticated, well-structured articles in the journal's voice: elegant, authoritative, 
and quietly luxurious. Use refined vocabulary, varied sentence structures, and editorial 
insight. Articles should feel curated, not generated.`
    );

    // Manual form state
    const [manualForm, setManualForm] = useState<ArticleFormState>({
        title: "",
        slug: "",
        category: "fashion",
        excerpt: "",
        content: "",
        author: "Editorial Team",
        tags: "[]",
        featured: false,
        published: false,
    });

    const handleAiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim() || !prompt.trim()) {
            setMessage({ type: "error", text: "Please provide both API key and prompt" });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("apiKey", apiKey);
        formData.append("provider", provider);
        formData.append("customBaseUrl", customBaseUrl);
        formData.append("model", model);
        formData.append("prompt", prompt);
        formData.append("systemPrompt", systemPrompt);

        try {
            const result = await generateArticle(null, formData);
            if (result.error) {
                setMessage({ type: "error", text: result.error });
            } else {
                setMessage({ type: "success", text: "Article generated successfully! Review and save below." });
                // Populate manual form with generated content
                if (result.article) {
                    setManualForm({
                        title: result.article.title,
                        slug: result.article.slug,
                        category: result.article.category,
                        excerpt: result.article.excerpt || "",
                        content: result.article.content,
                        author: result.article.author,
                        tags: result.article.tags,
                        featured: false,
                        published: false,
                    });
                    setActiveTab("manual");
                }
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to generate article" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        Object.entries(manualForm).forEach(([key, value]) => {
            formData.append(key, value);
        });

        try {
            const result = await fetch("/api/articles", {
                method: "POST",
                body: formData,
            }).then((r) => r.json());

            if (result.error) {
                setMessage({ type: "error", text: result.error });
            } else {
                setMessage({ type: "success", text: "Article saved successfully!" });
                setManualForm({
                    title: "",
                    slug: "",
                    category: "fashion",
                    excerpt: "",
                    content: "",
                    author: "Editorial Team",
                    tags: "[]",
                    featured: false,
                    published: false,
                });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Failed to save article" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setManualForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    return (
        <div className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab("ai")}
                    className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors ${activeTab === "ai"
                        ? "text-accent border-b-2 border-accent"
                        : "text-text-secondary hover:text-text-primary"
                        }`}
                >
                    AI Generator
                </button>
                <button
                    onClick={() => setActiveTab("manual")}
                    className={`px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors ${activeTab === "manual"
                        ? "text-accent border-b-2 border-accent"
                        : "text-text-secondary hover:text-text-primary"
                        }`}
                >
                    Manual Entry
                </button>
            </div>

            {message && (
                <div
                    className={`p-4 rounded-lg ${message.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* AI Generator Tab */}
            {activeTab === "ai" && (
                <form onSubmit={handleAiSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-text-secondary">
                                AI Provider
                            </label>
                            <select
                                value={provider}
                                onChange={(e) => setProvider(e.target.value as "openai" | "anthropic" | "openrouter" | "custom")}
                                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                            >
                                <option value="openai">OpenAI</option>
                                <option value="anthropic">Anthropic (Claude)</option>
                                <option value="openrouter">OpenRouter</option>
                                <option value="custom">Custom / Longcat</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-text-secondary">
                                Model
                            </label>
                            <input
                                type="text"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                placeholder={
                                    provider === "openai" ? "gpt-4-turbo-preview" :
                                        provider === "anthropic" ? "claude-3-opus-20240229" :
                                            provider === "openrouter" ? "openai/gpt-4-turbo, anthropic/claude-3-opus, meta-llama/llama-3-70b" :
                                                "model-name"
                                }
                                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>
                    </div>

                    {provider === "custom" && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-text-secondary">
                                Custom API Base URL
                            </label>
                            <input
                                type="url"
                                value={customBaseUrl}
                                onChange={(e) => setCustomBaseUrl(e.target.value)}
                                placeholder="https://api.longcat.chat/v1"
                                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-text-secondary">
                            API Key
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="sk-... or your API key"
                            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                            required
                        />
                        <p className="text-xs text-text-secondary">
                            Your API key is used only for this request and not stored.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-text-secondary">
                            System Prompt (Optional)
                        </label>
                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-text-secondary">
                            Article Prompt <span className="text-accent">*</span>
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                            placeholder="Describe the article you want to generate. Include topic, angle, key points, target section, tone, and any specific requirements..."
                            required
                        />
                        <p className="text-xs text-text-secondary">
                            Be specific: topic, angle, key points, target section (fashion/beauty/nail-design/home-decor/health/mom-special), desired tone, word count, etc.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto px-8 py-4 bg-text-primary hover:bg-accent text-white font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Generating..." : "Generate Article"}
                    </button>
                </form>
            )}

            {/* Manual Entry Tab */}
            {activeTab === "manual" && (
                <form onSubmit={handleManualSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-text-secondary">
                                Title <span className="text-accent">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={manualForm.title}
                                onChange={handleManualChange}
                                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-text-secondary">
                                Slug <span className="text-accent">*</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={manualForm.slug}
                                onChange={handleManualChange}
                                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-text-secondary">
                            Category <span className="text-accent">*</span>
                        </label>
                        <select
                            name="category"
                            value={manualForm.category}
                            onChange={handleManualChange}
                            className="w-full md:w-1/2 px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                            required
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.slug} value={cat.slug}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-text-secondary">
                            Excerpt
                        </label>
                        <textarea
                            name="excerpt"
                            value={manualForm.excerpt}
                            onChange={handleManualChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-text-secondary">
                            Content (HTML) <span className="text-accent">*</span>
                        </label>
                        <textarea
                            name="content"
                            value={manualForm.content}
                            onChange={handleManualChange}
                            rows={20}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent font-mono text-sm"
                            required
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-text-secondary">
                                Author
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={manualForm.author}
                                onChange={handleManualChange}
                                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-text-secondary">
                                Tags (JSON array)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={manualForm.tags}
                                onChange={handleManualChange}
                                className="w-full px-4 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-accent"
                                placeholder='["fashion", "spring", "trends"]'
                            />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={manualForm.featured}
                                onChange={handleManualChange}
                                className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                            />
                            <span className="text-sm text-text-secondary">Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="published"
                                checked={manualForm.published}
                                onChange={handleManualChange}
                                className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                            />
                            <span className="text-sm text-text-secondary">Published</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto px-8 py-4 bg-text-primary hover:bg-accent text-white font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Saving..." : "Save Article"}
                    </button>
                </form>
            )}
        </div>
    );
}