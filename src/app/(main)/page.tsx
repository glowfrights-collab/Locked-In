import { HeroSection } from "@/components/home/HeroSection";
import { SectionRow } from "@/components/home/SectionRow";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { StepsSection } from "@/components/home/StepsSection";
import {
  getFeaturedProducts,
  getTrendingProducts,
  getBundleProducts,
  getCategories,
} from "@/lib/products";

export default async function HomePage() {
  const [featured, trending, bundles, categories] = await Promise.all([
    getFeaturedProducts(),
    getTrendingProducts(),
    getBundleProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col divide-y divide-surface-border">
      <HeroSection />
      <SectionRow title="Featured" products={featured} viewAllHref="/explore?sort=newest" />
      <SectionRow title="Trending" products={trending} viewAllHref="/explore?sort=trending" />
      <SectionRow title="Prompt bundles" products={bundles} viewAllHref="/explore?type=BUNDLE" />
      <CategoryGrid categories={categories} />
      <StepsSection />
    </div>
  );
}
