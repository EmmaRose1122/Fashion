"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { CATEGORIES } from "@/lib/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/60 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo size="md" />

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`relative text-[11px] uppercase tracking-[0.18em] font-medium transition-colors hover:text-accent ${pathname === "/" ? "text-accent" : "text-text-secondary"
              }`}
          >
            Home
            {pathname === "/" && (
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent draw-line-x" />
            )}
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className={`relative text-[11px] uppercase tracking-[0.18em] font-medium transition-colors hover:text-accent ${isActive(`/${cat.slug}`) ? "text-accent" : "text-text-secondary"
                }`}
            >
              {cat.name}
              {isActive(`/${cat.slug}`) && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-accent draw-line-x" />
              )}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-7 h-7 space-y-1.5 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-text-primary transition-transform duration-300 ${isOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
          />
          <span
            className={`block w-6 h-0.5 bg-text-primary transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"
              }`}
          />
          <span
            className={`block w-6 h-0.5 bg-text-primary transition-transform duration-300 ${isOpen ? "transform -rotate-45 -translate-y-2" : ""
              }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden glass fixed inset-0 top-20 z-40 border-t border-border/60 animate-fade-in overflow-y-auto">
          <div className="flex flex-col items-center justify-start pt-12 space-y-8 pb-20 px-6">
            <Logo size="md" />
            <div className="flex flex-col items-center space-y-7 pt-6 w-full">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`text-lg uppercase tracking-[0.18em] hover:text-accent transition-colors ${pathname === "/" ? "text-accent" : "text-text-secondary"
                  }`}
              >
                Home
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg uppercase tracking-[0.18em] hover:text-accent transition-colors ${isActive(`/${cat.slug}`) ? "text-accent" : "text-text-secondary"
                    }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
