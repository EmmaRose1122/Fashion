# LUXE Portal

A clean, minimalist, high-performance website built with **Next.js 15** (App Router) and **Tailwind CSS v4**, serving three niches: **Female Fashion**, **Beauty**, and **Job Listings**. Integrated with **Supabase** and fully optimized for Vercel deployment.

## Features

- **Quiet Luxury UI/UX**: Understated elegance, beautiful typography (Playfair Display & Inter), generous whitespace, and responsive layouts.
- **Editorial Niche Feeds**: Dedicated feeds for Fashion, Beauty, Nail Design, Home Decor, Health, and Mom Special articles with custom server-side pagination.
- **Dynamic Careers Portal**: Structured Job Board allowing fast, server-side keyword search and filter options.
- **Secure Admin Panel**: Built-in Dashboard protected by custom JWT-cookie middleware to write, edit, and delete articles and job listings.
- **Advanced SEO & AEO**:
  - Dynamic Page Metadata (Metadata API)
  - Dynamic `sitemap.xml` and `robots.txt`
  - Automated JSON-LD structured data (`NewsArticle` and `JobPosting` schemas)
  - Structured heading hierarchies for Generative Engines (GEO).

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, React 19)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase PostgreSQL (via `@supabase/supabase-js`)
- **Authentication**: JWT Cookie Middleware (`jose`)
- **Image Optimization**: Supabase Storage + Next.js Image
- **Fonts**: `next/font` (Playfair Display, Inter)

## Getting Started

### 1. Database Setup

Create a Supabase project at [supabase.com](https://supabase.com), then set up your `.env.local` file:

```env
# Supabase
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="your-anon-public-key"

# Auth & Security
ADMIN_PASSWORD="your-secure-password"
JWT_SECRET="a-long-random-string-min-32-chars"

# Site
SITE_URL="http://localhost:3000"
```

### 2. Create Database Tables

Run the following SQL in the Supabase SQL editor to create the required tables and a public Storage bucket for thumbnails:

```sql
-- Articles table
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
create index article_slug_idx on public."Article" (slug);

-- Jobs table
create table public."Job" (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text,
  type text,
  salary text,
  description text not null,
  "applyLink" text not null,
  tags text default '[]',
  active boolean default true,
  featured boolean default false,
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

create index job_active_idx on public."Job" (active);

-- Auto-update updatedAt
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

create trigger article_updated_at
  before update on public."Article"
  for each row execute function public.set_updated_at();

create trigger job_updated_at
  before update on public."Job"
  for each row execute function public.set_updated_at();
```

Then in **Supabase Storage**, create a public bucket named `article-thumbnails` and allow public read access.

### 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the console with your `ADMIN_PASSWORD` (default redirects to login).

## Project Structure

```
src/
├── actions/         # Server actions (auth, articles, jobs)
├── app/
│   ├── [category]/  # Category feeds & article detail
│   ├── admin/       # Authenticated dashboard
│   ├── jobs/        # Public job board
│   ├── globals.css  # Tailwind v4 theme + utilities
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home / journal
│   ├── robots.ts    # robots.txt
│   └── sitemap.ts   # dynamic sitemap.xml
├── components/
│   ├── admin/       # Article & Job forms
│   ├── layout/      # Navbar, Footer
│   └── ui/          # Card, Pagination, TagBadge
├── lib/             # auth, supabase, constants, utils
└── middleware.ts    # JWT cookie verification
```

## Deployment

This project is optimized for **Vercel**:

1. Push to GitHub
2. Import in Vercel
3. Add the env vars from `.env.local` to the Vercel project
4. Deploy

The middleware, server actions, and dynamic metadata all work out-of-the-box on Vercel's edge runtime.
