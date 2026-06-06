export const SITE_NAME = "Fashion Hub";
export const SITE_DESCRIPTION = "Your destination for fashion, beauty, wellness, home, and lifestyle editorial content";
export const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
export const SITE_TAGLINE = "Quiet Luxury · Curated Editorial";

export const CATEGORIES = [
  {
    name: "Fashion",
    slug: "fashion",
    description: "Discover the latest trends, style guides, and fashion inspiration for the modern woman.",
    accent: "from-rose-50 to-pink-50",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Expert beauty tips, skincare routines, and product reviews to enhance your natural glow.",
    accent: "from-amber-50 to-yellow-50",
  },
  {
    name: "Nail Design",
    slug: "nail-design",
    description: "Trendy nail art, manicure inspiration, and polish guides for every season and occasion.",
    accent: "from-fuchsia-50 to-purple-50",
  },
  {
    name: "Home Decor",
    slug: "home-decor",
    description: "Curated interior styling, cozy living ideas, and design inspiration for modern homes.",
    accent: "from-emerald-50 to-teal-50",
  },
  {
    name: "Health",
    slug: "health",
    description: "Wellness routines, nutrition advice, fitness tips, and holistic self-care guidance.",
    accent: "from-sky-50 to-cyan-50",
  },
  {
    name: "Mom Special",
    slug: "mom-special",
    description: "Heartfelt stories, parenting tips, and lifestyle guides celebrating motherhood.",
    accent: "from-orange-50 to-amber-50",
  },
] as const;

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as readonly string[];

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Freelance",
] as const;

export const ARTICLES_PER_PAGE = 9;
export const JOBS_PER_PAGE = 10;
