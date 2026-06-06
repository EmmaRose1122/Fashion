import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SITE_DESCRIPTION, CATEGORIES } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        {/* Brand Section */}
        <div className="md:col-span-2 space-y-4">
          <Logo size="md" />
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto md:mx-0">
            {SITE_DESCRIPTION}
          </p>
          <p className="text-xs text-text-secondary/70 italic max-w-sm mx-auto md:mx-0">
            Crafting elegant editorial for the modern woman &mdash; fashion, beauty, lifestyle, and curated careers.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-text-primary font-bold">Editorial</h4>
          <ul className="space-y-2.5">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="text-sm text-text-secondary hover:text-accent gold-underline transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-text-primary font-bold">Explore</h4>
          <ul className="space-y-2.5">
            <li>
              <Link href="/jobs" className="text-sm text-text-secondary hover:text-accent gold-underline transition-colors">
                Careers Board
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-sm text-text-secondary hover:text-accent gold-underline transition-colors">
                Admin Console
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="text-sm text-text-secondary hover:text-accent gold-underline transition-colors">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border-light text-center">
        <p className="text-xs text-text-secondary">
          &copy; {currentYear} Fashion Hub. All rights reserved. Crafted with Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
