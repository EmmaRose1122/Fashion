# Fashion Hub

A clean, minimalist, high-performance website built with **Next.js 15** (App Router) and **Tailwind CSS v4**, serving three niches: **Female Fashion**, **Beauty**, and **Job Listings**. Integrated with **Supabase** and fully optimized for Vercel deployment.

## Features

- **Quiet Luxury UI/UX**: Understated elegance, beautiful typography (Playfair Display & Inter), generous whitespace, and responsive layouts.
- **Custom Crown Logo**: Hand-crafted SVG crown + "FASHION HUB" wordmark with hover micro-animations.
- **Editorial Niche Feeds**: Dedicated feeds for Fashion, Beauty, Nail Design, Home Decor, Health, and Mom Special articles with custom server-side pagination.
- **Dynamic Careers Portal**: Structured Job Board with fast, server-side keyword search and filters.
- **Secure Admin Panel**: Built-in Dashboard protected by JWT-cookie middleware at a separate URL.
- **Header & Site Code Manager**: Inject custom HTML into the site head/body, manage TXT records, and host HTML verification files — all from the admin dashboard, no redeploy needed.
- **Rich Animations**: scroll-triggered reveals, infinite marquee, shimmer text, hover-lift, fade-ups, and more (respects `prefers-reduced-motion`).
- **Advanced SEO & AEO**:
  - Dynamic Page Metadata (Metadata API)
  - Dynamic `sitemap.xml` and `robots.txt`
  - Automated JSON-LD structured data (`NewsArticle` and `JobPosting` schemas)

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, React 19)
- **Styling**: Tailwind CSS v4
- **Database**: Supabase PostgreSQL (via `@supabase/supabase-js`)
- **Authentication**: JWT Cookie Middleware (`jose`)
- **Fonts**: `next/font` (Playfair Display, Inter)

## Getting Started

### 1. Database Setup

Create a Supabase project at [supabase.com](https://supabase.com), then set up your `.env.local` file:

```env
# Supabase
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_ANON_KEY="your-anon-public-key"

# Auth & Security (overrides the built-in defaults)
ADMIN_EMAIL="editor@fashionhub.studio"
ADMIN_PASSWORD="FH-Curated-2026!Lux-Quiet"
JWT_SECRET="a-long-random-string-min-32-chars"

# Site
SITE_URL="http://localhost:3000"
```

> **Default credentials** (when env vars are not set):
> - Email: `editor@fashionhub.studio`
> - Password: `FH-Curated-2026!Lux-Quiet`
>
> Change them in `.env.local` for any non-local environment.

### 2. Create Database Tables

Run the following SQL in the Supabase SQL editor to create the required tables:

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

-- Settings (single-row table for site-wide code, e.g. header HTML, verifications)
create table public."Settings" (
  id integer primary key default 1,
  "headHtml" text default '',
  "bodyStartHtml" text default '',
  "bodyEndHtml" text default '',
  "txtRecords" jsonb default '[]'::jsonb,
  "htmlFiles" jsonb default '[]'::jsonb,
  "updatedAt" timestamp with time zone default now()
);

-- Seed the single Settings row
insert into public."Settings" (id) values (1) on conflict (id) do nothing;

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

- Open [http://localhost:3000](http://localhost:3000) to view the public journal.
- Open [http://localhost:3000/secure-portal](http://localhost:3000/secure-portal) to access the admin studio with your email + password.

## Admin Features

- **Console Overview** (`/admin`) — Article & job counts.
- **Manage Articles** (`/admin/articles`) — List, create, edit, delete.
- **Manage Jobs** (`/admin/jobs`) — List, create, edit, delete.
- **Header & Site Code** (`/admin/header`) — Inject custom HTML into the document head or body, manage TXT records (served at `/verify/[name].txt`), and upload HTML files (served at `/verify/[name].html`).

## Project Structure

```
src/
├── actions/         # Server actions (auth, articles, jobs, settings)
├── app/
│   ├── [category]/  # Category feeds & article detail
│   ├── admin/       # Authenticated dashboard
│   │   └── header/  # Header & Site Code manager
│   ├── jobs/        # Public job board
│   ├── secure-portal/  # Standalone admin login (email + password)
│   ├── verify/[name]/  # TXT / HTML verification files (dynamic)
│   ├── globals.css  # Tailwind v4 theme + animations
│   ├── layout.tsx   # Root layout + head/body injectors
│   ├── page.tsx     # Home / journal
│   ├── robots.ts    # robots.txt
│   └── sitemap.ts   # dynamic sitemap.xml
├── components/
│   ├── admin/       # Article, Job, HeaderCode forms
│   ├── layout/      # Navbar, Footer
│   ├── SiteCodeInjector.tsx  # Renders head/body custom HTML
│   └── ui/          # Logo, Crown, ArticleCard, JobCard, ...
├── lib/             # auth, supabase, constants, utils, settings
└── middleware.ts    # JWT cookie verification (protects /admin)
```

## Deployment

This project is optimized for **Vercel**:

1. Push to GitHub
2. Import in Vercel
3. Add the env vars from `.env.local` to the Vercel project
4. Deploy

The middleware, server actions, and dynamic metadata all work out-of-the-box on Vercel's edge runtime.
