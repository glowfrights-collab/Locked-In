// SQLite has no native Prisma enum support, so these string-backed unions are
// the source of truth for the "enum" fields in prisma/schema.prisma. Keep in
// sync with the comment block at the top of that file.

export const PRODUCT_TYPES = ["WALLPAPER", "PROMPT", "BUNDLE"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const UNLOCK_METHODS = ["AD", "SURVEY", "REFERRAL"] as const;
export type UnlockMethod = (typeof UNLOCK_METHODS)[number];

export const PROGRESS_STATUSES = ["PENDING", "COMPLETED"] as const;
export type ProgressStatus = (typeof PROGRESS_STATUSES)[number];

export const REFERRAL_STATUSES = ["PENDING", "COMPLETED", "REJECTED"] as const;
export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export const ANALYTICS_EVENT_TYPES = [
  "PRODUCT_VIEWED",
  "UNLOCK_METHOD_SELECTED",
  "AD_COMPLETED",
  "SURVEY_COMPLETED",
  "REFERRAL_SHARED",
  "REFERRAL_COMPLETED",
  "PRODUCT_UNLOCKED",
  "PRODUCT_DOWNLOADED",
] as const;
export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

/** Derived, not stored: overall unlock state of a product for a given user. */
export type ProductUnlockStatus = "Locked" | "InProgress" | "Unlocked";

export type UnlockMethodProgress = {
  method: UnlockMethod;
  enabled: boolean;
  currentCount: number;
  targetCount: number;
  status: ProgressStatus;
};

export type ProductSummary = {
  id: string;
  slug: string;
  title: string;
  type: ProductType;
  previewImageSeed: string;
  isFeatured: boolean;
  isTrending: boolean;
  categories: string[];
  unlockMethods: { method: UnlockMethod; targetCount: number }[];
};
