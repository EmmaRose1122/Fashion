# LUXE

An editorial journal of fashion, beauty, wellness, home, and lifestyle — written slowly, read deliberately.

A clean, minimalist, high-performance website built with **Next.js 15** (App Router) and **Tailwind CSS v4**, optimised for Vercel deployment.

## Features

- **Quiet Luxury UI/UX**: Editorial typography, generous whitespace, restrained palette, refined animations.
- **Six Curated Sections**: Fashion, Beauty, Nail Design, Home Decor, Health, Mom Special.
- **Dynamic Article Pages**: Server-rendered with custom `NewsArticle` JSON-LD structured data.
- **Advanced SEO**: Dynamic `sitemap.xml`, `robots.txt`, page metadata, and Open Graph tags.
- **Editorial Animations**: Scroll-triggered reveals, infinite marquee, shimmer text, hover lifts — all respecting `prefers-reduced-motion`.

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, Server Components)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Database**: Supabase PostgreSQL (read-only via `@supabase/supabase-js`)
- **Typography**: Fraunces (heading), Inter (body), Playfair Display (display/italic)
- **Deployment**: Vercel

## Getting Started

### 1. Environment Setup

Create `.env.local`:

```env
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="your-anon-public-key"
SITE_URL="http://localhost:3000"
```

### 2. Database

Create an `Article` table in Supabase:

```sql
create table public."Article" (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  category text not null,
  thumbnail text,
  author text default 'Editorial Team',
  tags text default '[]',
  published boolean default false,
  featured boolean default false,
  readTime integer default 1,
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

create index article_category_idx on public."Article" (category);
create index article_published_idx on public."Article" (published);
```

Use Supabase Studio to add and edit articles, set `published = true` to make them visible.

### 3. Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── actions/         # Server actions
├── app/
│   ├── [category]/  # Section feeds & article detail
│   ├── globals.css  # Tailwind theme + animations