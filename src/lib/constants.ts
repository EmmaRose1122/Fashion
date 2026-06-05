export const SITE_NAME = 'LUXE';
export const SITE_DESCRIPTION = 'Your destination for fashion, beauty, and career opportunities';
export const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

export const CATEGORIES = [
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Discover the latest trends, style guides, and fashion inspiration for the modern woman.',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Expert beauty tips, skincare routines, and product reviews to enhance your natural glow.',
  },
  {
    name: 'Jobs',
    slug: 'jobs',
    description: 'Browse curated career opportunities in fashion, beauty, and lifestyle industries.',
  },
] as const;

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Remote',
  'Contract',
  'Freelance',
] as const;

export const ARTICLES_PER_PAGE = 9;
export const JOBS_PER_PAGE = 10;
