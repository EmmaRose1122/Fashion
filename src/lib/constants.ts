export const SITE_NAME = "LUXE";
export const SITE_DESCRIPTION =
  "An editorial journal of fashion, beauty, wellness, home, and lifestyle — written slowly, read deliberately.";
export const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
export const SITE_TAGLINE = "The Quiet Journal";

export const CATEGORIES = [
  {
    name: "Fashion",
    slug: "fashion",
    description: "Discover the latest trends, style guides, and fashion inspiration for the modern woman.",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Expert beauty tips, skincare routines, and product reviews to enhance your natural glow.",
  },
  {
    name: "Nail Design",
    slug: "nail-design",
    description: "Trendy nail art, manicure inspiration, and polish guides for every season and occasion.",
  },
  {
    name: "Home Decor",
    slug: "home-decor",
    description: "Curated interior styling, cozy living ideas, and design inspiration for modern homes.",
  },
  {
    name: "Health",
    slug: "health",
    description: "Wellness routines, nutrition advice, fitness tips, and holistic self-care guidance.",
  },
  {
    name: "Mom Special",
    slug: "mom-special",
    description: "Heartfelt stories, parenting tips, and lifestyle guides celebrating motherhood.",
  },
] as const;

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as readonly string[];

export const ARTICLES_PER_PAGE = 9;
