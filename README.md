# LUXE Portal

A clean, minimalist, high-performance website built with Next.js (App Router) and Tailwind CSS v4, serving three niches: **Female Fashion**, **Beauty**, and **Job Listings**. Integrated with Supabase (via Prisma ORM) and fully optimized for Vercel deployment.

## Features

- **Quiet Luxury UI/UX**: Understated elegance, beautiful typography (Playfair Display & Inter), generous whitespace, and responsive layouts.
- **Editorial Niche Feeds**: Dedicated feeds for Fashion and Beauty articles with custom server-side pagination.
- **Dynamic Careers Portal**: Structured Job Board allowing fast, server-side keyword search and filter options.
- **Secure Admin Panel**: Built-in Dashboard protected by custom JWT-cookie middleware to write, edit, and delete articles and job listings.
- **Advanced SEO & AEO**:
  - Dynamic Page Metadata (Metadata API)
  - Dynamic `sitemap.xml` and `robots.txt`
  - Automated JSON-LD structured data (`NewsArticle` and `JobPosting` schemas)
  - Structured heading hierarchies for Generative Engines (GEO).

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Styling**: Tailwind CSS v4
- **ORM**: Prisma Client
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT Cookie Middleware

## Getting Started

### 1. Database Setup
Retrieve your pooled and direct connection string URIs from the Supabase Dashboard, and set up your `.env.local` file:
```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
ADMIN_PASSWORD="your-secure-password"
JWT_SECRET="your-jwt-secret-key"
SITE_URL="http://localhost:3000"
```

### 2. Install Dependencies & Seed
```bash
npm install
npx prisma db push
npx prisma db seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the console with your `ADMIN_PASSWORD`.
