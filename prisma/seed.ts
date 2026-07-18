import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Minimal", slug: "minimal" },
  { name: "Cars", slug: "cars" },
  { name: "Nature", slug: "nature" },
  { name: "Anime-inspired", slug: "anime-inspired" },
  { name: "Architecture", slug: "architecture" },
  { name: "Abstract", slug: "abstract" },
  { name: "Dark", slug: "dark" },
  { name: "Motivational", slug: "motivational" },
];

const TAGS = [
  "phone",
  "tablet",
  "desktop",
  "4k",
  "pastel",
  "neon",
  "vector",
  "photo-real",
  "y2k",
  "retro",
  "gradient",
  "line-art",
  "monochrome",
  "hd",
  "aesthetic",
];

type UnlockConfig = { method: "AD" | "SURVEY" | "REFERRAL"; targetCount: number }[];

const AD_ONLY_1: UnlockConfig = [{ method: "AD", targetCount: 1 }];
const AD_ONLY_2: UnlockConfig = [{ method: "AD", targetCount: 2 }];
const SURVEY_ONLY: UnlockConfig = [{ method: "SURVEY", targetCount: 1 }];
const REFERRAL_ONLY: UnlockConfig = [{ method: "REFERRAL", targetCount: 1 }];
const AD_OR_SURVEY: UnlockConfig = [
  { method: "AD", targetCount: 2 },
  { method: "SURVEY", targetCount: 1 },
];
const ALL_THREE: UnlockConfig = [
  { method: "AD", targetCount: 2 },
  { method: "SURVEY", targetCount: 1 },
  { method: "REFERRAL", targetCount: 1 },
];

type SeedProduct = {
  slug: string;
  title: string;
  description: string;
  type: "WALLPAPER" | "PROMPT" | "BUNDLE";
  resolution: string;
  fileFormat: string;
  deviceType: string;
  categories: string[];
  tags: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  unlock: UnlockConfig;
};

const PRODUCTS: SeedProduct[] = [
  // --- Wallpapers ---
  {
    slug: "minimal-fog",
    title: "Minimal Fog",
    description: "A soft, foggy gradient wallpaper with a calm minimal palette.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["minimal"],
    tags: ["pastel", "phone", "aesthetic"],
    isFeatured: true,
    unlock: AD_ONLY_1,
  },
  {
    slug: "soft-grid-minimal",
    title: "Soft Grid",
    description: "A quiet grid pattern wallpaper for a clean home screen.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["minimal"],
    tags: ["vector", "monochrome", "phone"],
    unlock: SURVEY_ONLY,
  },
  {
    slug: "retro-muscle-car",
    title: "Retro Muscle Car",
    description: "A sun-drenched shot of a classic muscle car on an open road.",
    type: "WALLPAPER",
    resolution: "2160x3840",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["cars"],
    tags: ["retro", "photo-real", "4k"],
    isTrending: true,
    unlock: AD_OR_SURVEY,
  },
  {
    slug: "night-drive",
    title: "Night Drive",
    description: "Neon city streaks captured through a windshield at night.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "iPhone",
    categories: ["cars", "dark"],
    tags: ["neon", "photo-real", "phone"],
    unlock: AD_ONLY_2,
  },
  {
    slug: "misty-forest",
    title: "Misty Forest",
    description: "Tall pines fading into morning mist.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["nature"],
    tags: ["photo-real", "aesthetic", "phone"],
    isFeatured: true,
    unlock: AD_ONLY_1,
  },
  {
    slug: "ocean-horizon",
    title: "Ocean Horizon",
    description: "A clean line between sea and sky at golden hour.",
    type: "WALLPAPER",
    resolution: "2160x3840",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["nature"],
    tags: ["photo-real", "4k", "aesthetic"],
    unlock: REFERRAL_ONLY,
  },
  {
    slug: "anime-skyline",
    title: "Anime Skyline",
    description: "A hand-painted anime-style city skyline at dusk.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["anime-inspired"],
    tags: ["vector", "gradient", "phone"],
    isTrending: true,
    unlock: AD_OR_SURVEY,
  },
  {
    slug: "cherry-blossom-anime",
    title: "Cherry Blossom",
    description: "Soft pink cherry blossoms in an anime-inspired scene.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["anime-inspired"],
    tags: ["pastel", "vector", "phone"],
    unlock: SURVEY_ONLY,
  },
  {
    slug: "brutalist-facade",
    title: "Brutalist Facade",
    description: "Stark concrete geometry captured in harsh daylight.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["architecture"],
    tags: ["monochrome", "photo-real", "phone"],
    unlock: AD_ONLY_1,
  },
  {
    slug: "glass-tower",
    title: "Glass Tower",
    description: "A reflective glass skyscraper shot from street level.",
    type: "WALLPAPER",
    resolution: "2160x3840",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["architecture"],
    tags: ["photo-real", "4k", "aesthetic"],
    isFeatured: true,
    unlock: ALL_THREE,
  },
  {
    slug: "abstract-waves",
    title: "Abstract Waves",
    description: "Flowing abstract waveforms in a limited color palette.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["abstract"],
    tags: ["gradient", "vector", "phone"],
    isTrending: true,
    unlock: AD_ONLY_2,
  },
  {
    slug: "fluid-gradient",
    title: "Fluid Gradient",
    description: "A smooth, colorful fluid gradient wallpaper.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["abstract"],
    tags: ["gradient", "pastel", "phone"],
    unlock: SURVEY_ONLY,
  },
  {
    slug: "midnight-black",
    title: "Midnight Black",
    description: "A near-black wallpaper built for AMOLED screens.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Android",
    categories: ["dark"],
    tags: ["monochrome", "phone", "aesthetic"],
    isFeatured: true,
    unlock: AD_ONLY_1,
  },
  {
    slug: "dark-marble",
    title: "Dark Marble",
    description: "Black and gold marble texture wallpaper.",
    type: "WALLPAPER",
    resolution: "2160x3840",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["dark"],
    tags: ["monochrome", "4k", "aesthetic"],
    unlock: REFERRAL_ONLY,
  },
  {
    slug: "rise-and-grind",
    title: "Rise and Grind",
    description: "Bold typography wallpaper to start the day right.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["motivational"],
    tags: ["vector", "monochrome", "phone"],
    isTrending: true,
    unlock: AD_OR_SURVEY,
  },
  {
    slug: "never-give-up",
    title: "Never Give Up",
    description: "A minimal motivational quote wallpaper.",
    type: "WALLPAPER",
    resolution: "1080x1920",
    fileFormat: "JPG",
    deviceType: "Universal",
    categories: ["motivational"],
    tags: ["vector", "pastel", "phone"],
    unlock: AD_ONLY_1,
  },

  // --- AI Prompts ---
  {
    slug: "neon-cityscape-prompt",
    title: "Neon Cityscape Prompt Pack",
    description: "A set of prompts for generating neon-soaked cyberpunk cityscapes.",
    type: "PROMPT",
    resolution: "N/A",
    fileFormat: "TXT",
    deviceType: "Universal",
    categories: ["abstract", "dark"],
    tags: ["neon", "y2k"],
    unlock: AD_ONLY_2,
  },
  {
    slug: "anime-portrait-prompt",
    title: "Anime Portrait Prompt",
    description: "Prompt for generating stylized anime character portraits.",
    type: "PROMPT",
    resolution: "N/A",
    fileFormat: "TXT",
    deviceType: "Universal",
    categories: ["anime-inspired"],
    tags: ["vector", "aesthetic"],
    isTrending: true,
    unlock: SURVEY_ONLY,
  },
  {
    slug: "motivational-quote-art-prompt",
    title: "Motivational Quote Art Prompt",
    description: "Prompt for turning any quote into a poster-style wallpaper.",
    type: "PROMPT",
    resolution: "N/A",
    fileFormat: "TXT",
    deviceType: "Universal",
    categories: ["motivational"],
    tags: ["vector", "monochrome"],
    unlock: REFERRAL_ONLY,
  },
  {
    slug: "nature-fantasy-prompt",
    title: "Nature Fantasy Prompt",
    description: "Prompt for lush, otherworldly nature landscapes.",
    type: "PROMPT",
    resolution: "N/A",
    fileFormat: "TXT",
    deviceType: "Universal",
    categories: ["nature"],
    tags: ["photo-real", "aesthetic"],
    unlock: AD_ONLY_1,
  },
  {
    slug: "car-concept-art-prompt",
    title: "Car Concept Art Prompt",
    description: "Prompt for futuristic car concept renders.",
    type: "PROMPT",
    resolution: "N/A",
    fileFormat: "TXT",
    deviceType: "Universal",
    categories: ["cars"],
    tags: ["photo-real", "neon"],
    unlock: ALL_THREE,
  },
  {
    slug: "minimal-line-art-prompt",
    title: "Minimal Line Art Prompt",
    description: "Prompt for single-line minimalist illustrations.",
    type: "PROMPT",
    resolution: "N/A",
    fileFormat: "TXT",
    deviceType: "Universal",
    categories: ["minimal"],
    tags: ["line-art", "monochrome"],
    unlock: SURVEY_ONLY,
  },

  // --- Bundles ---
  {
    slug: "dark-aesthetic-bundle",
    title: "Dark Aesthetic Bundle",
    description: "A themed collection of 10 dark, moody wallpapers.",
    type: "BUNDLE",
    resolution: "Multiple",
    fileFormat: "ZIP",
    deviceType: "Universal",
    categories: ["dark", "abstract"],
    tags: ["monochrome", "aesthetic", "4k"],
    isFeatured: true,
    unlock: AD_OR_SURVEY,
  },
  {
    slug: "anime-hero-bundle",
    title: "Anime Hero Bundle",
    description: "A themed collection of anime-inspired hero wallpapers.",
    type: "BUNDLE",
    resolution: "Multiple",
    fileFormat: "ZIP",
    deviceType: "Universal",
    categories: ["anime-inspired"],
    tags: ["vector", "gradient"],
    isTrending: true,
    unlock: AD_ONLY_2,
  },
  {
    slug: "architecture-mono-bundle",
    title: "Architecture Mono Bundle",
    description: "Black-and-white architectural photography wallpaper set.",
    type: "BUNDLE",
    resolution: "Multiple",
    fileFormat: "ZIP",
    deviceType: "Universal",
    categories: ["architecture"],
    tags: ["monochrome", "photo-real"],
    unlock: REFERRAL_ONLY,
  },
  {
    slug: "nature-escape-bundle",
    title: "Nature Escape Bundle",
    description: "A calming set of nature wallpapers for every screen.",
    type: "BUNDLE",
    resolution: "Multiple",
    fileFormat: "ZIP",
    deviceType: "Universal",
    categories: ["nature"],
    tags: ["photo-real", "aesthetic"],
    unlock: SURVEY_ONLY,
  },
  {
    slug: "motivation-pack-bundle",
    title: "Motivation Pack",
    description: "10 bold motivational wallpapers to keep you focused.",
    type: "BUNDLE",
    resolution: "Multiple",
    fileFormat: "ZIP",
    deviceType: "Universal",
    categories: ["motivational"],
    tags: ["vector", "monochrome"],
    unlock: AD_ONLY_1,
  },
  {
    slug: "cars-legends-bundle",
    title: "Car Legends Bundle",
    description: "A themed collection of legendary car photography.",
    type: "BUNDLE",
    resolution: "Multiple",
    fileFormat: "ZIP",
    deviceType: "Universal",
    categories: ["cars"],
    tags: ["photo-real", "retro"],
    unlock: ALL_THREE,
  },
];

async function main() {
  console.log(`Seeding ${PRODUCTS.length} products across ${CATEGORIES.length} categories...`);

  const categoryBySlug = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoryBySlug.set(cat.slug, created.id);
  }

  const tagBySlug = new Map<string, string>();
  for (const tagName of TAGS) {
    const slug = tagName;
    const created = await prisma.tag.upsert({
      where: { slug },
      update: { name: tagName },
      create: { name: tagName, slug },
    });
    tagBySlug.set(slug, created.id);
  }

  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        type: p.type,
        resolution: p.resolution,
        fileFormat: p.fileFormat,
        deviceType: p.deviceType,
        previewImageSeed: p.slug,
        isFeatured: p.isFeatured ?? false,
        isTrending: p.isTrending ?? false,
      },
      create: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        type: p.type,
        resolution: p.resolution,
        fileFormat: p.fileFormat,
        deviceType: p.deviceType,
        previewImageSeed: p.slug,
        isFeatured: p.isFeatured ?? false,
        isTrending: p.isTrending ?? false,
      },
    });

    // Reset join rows + files + requirements so re-running the seed is idempotent.
    await prisma.productCategory.deleteMany({ where: { productId: product.id } });
    await prisma.productTag.deleteMany({ where: { productId: product.id } });
    await prisma.unlockRequirement.deleteMany({ where: { productId: product.id } });
    await prisma.productFile.deleteMany({ where: { productId: product.id } });

    for (const catSlug of p.categories) {
      const categoryId = categoryBySlug.get(catSlug);
      if (!categoryId) continue;
      await prisma.productCategory.create({
        data: { productId: product.id, categoryId },
      });
    }

    for (const tagSlug of p.tags) {
      const tagId = tagBySlug.get(tagSlug);
      if (!tagId) continue;
      await prisma.productTag.create({
        data: { productId: product.id, tagId },
      });
    }

    for (const req of p.unlock) {
      await prisma.unlockRequirement.create({
        data: {
          productId: product.id,
          method: req.method,
          enabled: true,
          targetCount: req.targetCount,
        },
      });
    }

    await prisma.productFile.create({
      data: {
        productId: product.id,
        kind: "download",
        seed: p.slug,
        width: 1080,
        height: 1920,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
