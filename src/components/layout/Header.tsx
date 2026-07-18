import Link from "next/link";
import { SearchIcon, MenuIcon } from "@/components/ui/Icons";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-border bg-surface/90 px-4 backdrop-blur">
      <Link href="/" className="text-lg font-semibold tracking-tight text-ink">
        Unlock
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/explore?focus=search"
          aria-label="Search"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface-muted"
        >
          <SearchIcon />
        </Link>
        <details className="relative">
          <summary
            aria-label="Menu"
            className="flex h-11 w-11 list-none items-center justify-center rounded-full text-ink hover:bg-surface-muted [&::-webkit-details-marker]:hidden"
          >
            <MenuIcon />
          </summary>
          <nav className="absolute right-0 top-12 z-40 w-48 rounded-2xl border border-surface-border bg-surface p-2 shadow-card animate-slide-up">
            <Link
              href="/explore"
              className="block rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-muted"
            >
              Explore
            </Link>
            <Link
              href="/saved"
              className="block rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-muted"
            >
              Saved
            </Link>
            <Link
              href="/account"
              className="block rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-surface-muted"
            >
              Account
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
