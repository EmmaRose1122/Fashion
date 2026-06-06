import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SITE_NAME, SITE_DESCRIPTION, CATEGORIES } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="space-y-5 md:col-span-1">
          <Logo size="md" />
          <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto md:mx-0">
            {SITE_DESCRIPTION}
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-semibold pt-2">
            Est. 2026
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-text-primary font-bold">
            Editorial
          </h4>
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

        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-text-primary font-bold">
            The Journal
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed italic">
            Style is a quiet language. Read it slowly.
          </p>
          <Link
            href="/sitemap.xml"
            className="inline-block text-[10px] uppercase tracking-[0.3em] text-text-secondary hover:text-accent gold-underline font-semibold pt-2"
          >
            Sitemap
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border-light text-center">
        <p className="text-xs text-text-secondary">
          &copy; {currentYear} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
