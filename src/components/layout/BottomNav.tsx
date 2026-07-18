"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HomeIcon, ExploreIcon, SavedIcon, AccountIcon } from "@/components/ui/Icons";

const TABS = [
  { href: "/", label: "Home", icon: HomeIcon, match: (p: string) => p === "/" },
  {
    href: "/explore",
    label: "Explore",
    icon: ExploreIcon,
    match: (p: string) => p.startsWith("/explore") || p.startsWith("/product"),
  },
  { href: "/saved", label: "Saved", icon: SavedIcon, match: (p: string) => p.startsWith("/saved") },
  {
    href: "/account",
    label: "Account",
    icon: AccountIcon,
    match: (p: string) => p.startsWith("/account"),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <Icon
                className={cn("h-6 w-6", active ? "text-ink" : "text-ink-faint")}
              />
              <span
                className={cn(
                  "text-[11px] font-medium",
                  active ? "text-ink" : "text-ink-faint"
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
