import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="flex flex-col gap-4 px-4 pb-8 pt-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Unlock wallpapers without paying
      </h1>
      <p className="mx-auto max-w-xs text-sm text-ink-soft">
        Watch an ad, answer a quick survey, or refer a friend — unlock premium
        wallpapers, AI prompts and art collections for free.
      </p>
      <div className="mt-2 flex justify-center">
        <Button href="/explore" size="lg">
          Explore wallpapers
        </Button>
      </div>
    </section>
  );
}
