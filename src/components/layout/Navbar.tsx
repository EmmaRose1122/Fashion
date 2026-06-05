"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME, CATEGORIES } from "@/lib/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false;
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-heading text-2xl tracking-widest text-text-primary hover:opacity-80 transition-opacity">
          {SITE_NAME}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <Link
            href="/"
            className={`text-xs uppercase tracking-widest transition-colors hover:text-accent ${
              pathname === "/" ? "text-accent font-semibold" : "text-text-secondary"
            }`}
          >
            Home
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className={`text-xs uppercase tracking-widest transition-colors hover:text-accent ${
                isActive(`/${cat.slug}`) ? "text-accent font-semibold" : "text-text-secondary"
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/admin"
            className="text-xs uppercase tracking-widest border border-accent/30 px-4 py-2 hover:bg-accent hover:text-white transition-all text-text-secondary rounded-sm"
          >
            Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1.5 focus:outline-none"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-transform duration-300 ${
              isOpen ? "transform rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-opacity duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-text-primary transition-transform duration-300 ${
              isOpen ? "transform -rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-background/98 z-40 border-t border-border/50 animate-fade-in">
          <div className="flex flex-col items-center justify-center space-y-8 h-[calc(100vh-5rem)] pb-20">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`text-lg uppercase tracking-widest hover:text-accent transition-colors ${
                pathname === "/" ? "text-accent" : "text-text-secondary"
              }`}
            >
              Home
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                onClick={() => setIsOpen(false)}
                className={`text-lg uppercase tracking-widest hover:text-accent transition-colors ${
                  isActive(`/${cat.slug}`) ? "text-accent" : "text-text-secondary"
                }`}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="text-lg uppercase tracking-widest border border-accent/40 px-6 py-2.5 text-text-secondary hover:bg-accent hover:text-white transition-all rounded-sm"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
