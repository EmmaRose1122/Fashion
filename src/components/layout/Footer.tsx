import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION, CATEGORIES } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Brand Section */}
        <div className="space-y-4">
          <Link href="/" className="font-heading text-2xl tracking-widest text-text-primary">
            {SITE_NAME}
          </Link>
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto md:mx-0">
            {SITE_DESCRIPTION}
          </p>
        </div>

        {/* Links Section */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-text-primary font-bold">Categories</h4>
          <ul className="space-y-2.5">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/${cat.slug}`}
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest text-text-primary font-bold">Quiet Luxury</h4>
          <p className="text-sm text-text-secondary leading-relaxed">
            Crafting elegant content for fashion, beauty, and professional career transitions.
          </p>
          <div className="pt-2">
            <span className="text-xs uppercase tracking-wider text-accent border-b border-accent/20 pb-1">
              EST. 2026
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border-light text-center">
        <p className="text-xs text-text-secondary">
          &copy; {currentYear} {SITE_NAME}. All rights reserved. Created with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
