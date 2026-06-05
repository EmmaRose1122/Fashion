import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  await prisma.article.deleteMany({});
  await prisma.job.deleteMany({});

  console.log("Seeding fashion and beauty articles...");

  // Fashion Articles
  await prisma.article.create({
    data: {
      title: "The Quiet Luxury Aesthetic: An Essential Guide to Minimalism",
      slug: "the-quiet-luxury-aesthetic-essential-guide-to-minimalism",
      excerpt: "Explore the understated elegance of quiet luxury. Learn how to curate a timeless wardrobe with high-quality basics, neutral tones, and classic cuts.",
      category: "fashion",
      content: `
        <h2>Understated Elegance</h2>
        <p>Quiet luxury is more than just a passing fashion trend; it represents a fundamental shift towards mindful consumption and style longevity. Unlike logocentric apparel, quiet luxury prioritizes exquisite fabrics, perfect tailoring, and clean lines.</p>
        
        <h2>How to Build a Capsule Wardrobe</h2>
        <p>To embody this aesthetic, focus on purchasing fewer, higher-quality items. Look for natural materials like cashmere, silk, organic cotton, and fine wool. Here are key foundational pieces:</p>
        <ul>
          <li>A perfectly tailored wool trench coat in camel or charcoal.</li>
          <li>Silk button-down shirts in cream or crisp off-white.</li>
          <li>High-waisted, wide-leg trousers that drape beautifully.</li>
          <li>Minimalist leather loafers or ballet flats with subtle hardware.</li>
        </ul>
        
        <blockquote>"True elegance does not demand attention; it commands respect through its simplicity and attention to detail."</blockquote>
        
        <h2>The Color Palette</h2>
        <p>Stick to a harmonious range of neutrals. Creams, warm beige, soft oatmeal, navy, forest green, and classic black form the backbone of the quiet luxury palette. These colors are effortlessly interchangeable, allowing you to create numerous sophisticated looks with minimal effort.</p>
      `,
      tags: JSON.stringify(["fashion", "luxury", "minimalism", "style"]),
      thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
      published: true,
      featured: true,
      author: "Sofia Loren",
      readTime: 4,
    },
  });

  await prisma.article.create({
    data: {
      title: "Parisian Chic: Trans-Seasonal Styling Secrets",
      slug: "parisian-chic-trans-seasonal-styling-secrets",
      excerpt: "Master the art of effortless dressing between seasons with classic Parisian fashion principles that combine comfort with style.",
      category: "fashion",
      content: `
        <h2>The Art of Effortless Layering</h2>
        <p>Transitioning between summer and autumn or winter and spring can be styling territory. Parisian women have mastered this art through light, breathable layers and structured accessories.</p>
        
        <h2>Secrets of the Parisian Wardrobe</h2>
        <p>The secret lies in the juxtaposition of casual and formal elements. Pair a structured blazer with vintage straight-leg jeans, or an oversized knit sweater with a flowing silk midi skirt.</p>
        <ul>
          <li>Invest in high-quality striped cotton Breton shirts.</li>
          <li>Opt for unstructured wool jackets.</li>
          <li>Keep jewelry minimal: a thin gold chain or simple hoop earrings.</li>
        </ul>
      `,
      tags: JSON.stringify(["fashion", "styling", "parisian", "trends"]),
      thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      published: true,
      featured: false,
      author: "Camille Cottin",
      readTime: 3,
    },
  });

  // Beauty Articles
  await prisma.article.create({
    data: {
      title: "The Skin-First Beauty Philosophy: Achieving the Glass Skin Glow",
      slug: "skin-first-beauty-philosophy-achieving-glass-skin-glow",
      excerpt: "Unlock the secrets to luminous, glass-like skin with our skin-first philosophy. Discover the ideal skincare routine for deep hydration and cell renewal.",
      category: "beauty",
      content: `
        <h2>Nourishing from Within</h2>
        <p>Modern beauty is moving away from heavy foundations and color corrections towards achieving a healthy, naturally radiant skin barrier. The "glass skin" trend focuses on intense hydration, gentle exfoliation, and barrier defense.</p>
        
        <h2>The Step-by-Step Routine</h2>
        <p>Consistency is key to transforming your complexion. Follow this clean, effective morning and night routine:</p>
        <ol>
          <li><strong>Double Cleanse:</strong> Use a gentle oil-based cleanser followed by a hydrating water-based cleanser to remove impurities without stripping lipids.</li>
          <li><strong>Hydrating Toner:</strong> Apply a skin-plumping hyaluronic acid or beta-glucan toner to damp skin.</li>
          <li><strong>Vitamin C Serum:</strong> Brighten skin and combat free radical damage with a daily antioxidant serum.</li>
          <li><strong>Ceramide Moisturizer:</strong> Lock in hydration and repair the lipid barrier with a rich, unscented cream.</li>
        </ol>
        
        <blockquote>"Beautiful makeup starts with healthy, happy skin. Treat your face like a canvas that deserves premium nourishment."</blockquote>
        
        <h2>Lifestyle Factors</h2>
        <p>Remember that topical applications are only half the battle. Drink plenty of water, get 8 hours of sleep, and eat antioxidant-rich foods like berries, leafy greens, and healthy fats (avocado, nuts) to fuel skin regeneration.</p>
      `,
      tags: JSON.stringify(["beauty", "skincare", "glow", "routine"]),
      thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
      published: true,
      featured: true,
      author: "Elena Rostova",
      readTime: 5,
    },
  });

  await prisma.article.create({
    data: {
      title: "Clean Beauty Demystified: Safe Ingredients to Look For",
      slug: "clean-beauty-demystified-safe-ingredients-to-look-for",
      excerpt: "What does clean beauty really mean? We break down the confusing terms and list the top non-toxic ingredients to add to your daily vanity.",
      category: "beauty",
      content: `
        <h2>Defining Clean Beauty</h2>
        <p>With so much greenwashing in the cosmetics industry, identifying truly safe products can be overwhelming. Clean beauty simply means products that are formulated with non-toxic, safe ingredients that do not compromise your health.</p>
        
        <h2>Ingredients to Look For</h2>
        <p>Look for formulations that contain active botanical oils, soothing centella asiatica, niacinamide (Vitamin B3), and squalane.</p>
      `,
      tags: JSON.stringify(["beauty", "clean-beauty", "wellness", "ingredients"]),
      thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
      published: true,
      featured: false,
      author: "Elena Rostova",
      readTime: 3,
    },
  });

  console.log("Seeding job listings...");

  // Job Postings
  await prisma.job.create({
    data: {
      title: "Senior Fashion Designer (Haute Couture)",
      company: "Maison de L'Élégance",
      location: "New York City, NY (Hybrid)",
      type: "Full-time",
      salary: "$120,000 - $150,000 / year",
      description: `
        <h2>About the Role</h2>
        <p>Maison de L'Élégance is seeking an exceptional Senior Fashion Designer to lead our upcoming autumn haute couture collection. You will collaborate directly with our Creative Director to craft luxury garments that push boundaries while retaining classic sophistication.</p>
        
        <h2>Key Responsibilities</h2>
        <ul>
          <li>Create detailed hand-drawn sketches and technical flat designs.</li>
          <li>Select premium luxury fabrics, trimmings, and embroidery elements.</li>
          <li>Oversee the design process from initial concept, draping, and fitting to final runway presentation.</li>
          <li>Mentor junior designers and interns within the atelier.</li>
        </ul>
        
        <h2>Requirements</h2>
        <p>Must have a Bachelor's degree in Fashion Design, 6+ years of design experience in luxury fashion houses, and a stellar portfolio demonstrating expertise in draping, pattern making, and fabric selection.</p>
      `,
      applyLink: "https://example.com/careers/maison-designer",
      tags: JSON.stringify(["designer", "couture", "luxury", "styling"]),
      active: true,
      featured: true,
    },
  });

  await prisma.job.create({
    data: {
      title: "Senior Brand Manager (Cosmetics & Skincare)",
      company: "Aura Beauty Group",
      location: "Los Angeles, CA (On-site)",
      type: "Full-time",
      salary: "$110,000 - $130,000 / year",
      description: `
        <h2>About the Role</h2>
        <p>Aura Beauty is seeking an experienced Senior Brand Manager to oversee our skincare product portfolio. You will lead marketing campaigns, packaging design, and product launch strategies across retail partners like Sephora and Ulta.</p>
        
        <h2>Requirements</h2>
        <p>4+ years of brand management experience in the cosmetics or beauty sector. Strong analytical skills and experience managing marketing budgets are required.</p>
      `,
      applyLink: "https://example.com/careers/aura-brand-manager",
      tags: JSON.stringify(["marketing", "beauty", "brand-manager", "retail"]),
      active: true,
      featured: true,
    },
  });

  await prisma.job.create({
    data: {
      title: "Creative Director (Freelance / Remote)",
      company: "Vogue Creative Agency",
      location: "Remote",
      type: "Contract",
      salary: "$90 - $120 / hour",
      description: `
        <h2>About the Role</h2>
        <p>Vogue Creative is hiring a contract Creative Director to lead digital editorial shoots and campaigns for luxury lifestyle clients. This is a fully remote position with occasional travel for photoshoot oversight.</p>
      `,
      applyLink: "https://example.com/careers/vogue-creative",
      tags: JSON.stringify(["creative-director", "editorial", "remote", "design"]),
      active: true,
      featured: false,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
