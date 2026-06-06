"use client";

import Link from "next/link";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            <header className="border-b border-border pb-8">
                <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight">
                    Admin Dashboard
                </h1>
                <p className="text-text-secondary mt-2">
                    Manage articles and generate content with AI
                </p>
            </header>

            <section className="space-y-6">
                <h2 className="font-heading text-2xl font-semibold">AI Article Generator</h2>
                <p className="text-text-secondary">
                    Create new articles using AI. Provide your API key and a detailed prompt.
                </p>
                <ArticleForm />
            </section>

            <section className="border-t border-border pt-8 space-y-6">
                <h2 className="font-heading text-2xl font-semibold">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Link
                        href="/fashion"
                        className="p-6 border border-border rounded-lg hover:border-accent transition-colors group"
                    >
                        <h3 className="font-heading text-lg font-semibold group-hover:text-accent transition-colors">
                            View Fashion Section
                        </h3>
                        <p className="text-text-secondary text-sm mt-1">Browse published fashion articles</p>
                    </Link>
                    <Link
                        href="/beauty"
                        className="p-6 border border-border rounded-lg hover:border-accent transition-colors group"
                    >
                        <h3 className="font-heading text-lg font-semibold group-hover:text-accent transition-colors">
                            View Beauty Section
                        </h3>
                        <p className="text-text-secondary text-sm mt-1">Browse published beauty articles</p>
                    </Link>
                    <Link
                        href="/"
                        className="p-6 border border-border rounded-lg hover:border-accent transition-colors group"
                    >
                        <h3 className="font-heading text-lg font-semibold group-hover:text-accent transition-colors">
                            View Homepage
                        </h3>
                        <p className="text-text-secondary text-sm mt-1">See the main journal page</p>
                    </Link>
                </div>
            </section>
        </div>
    );
}
