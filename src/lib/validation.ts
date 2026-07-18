import { z } from "zod";
import { PRODUCT_TYPES, UNLOCK_METHODS } from "@/lib/types";

export const productIdSchema = z.object({
  productId: z.string().min(1),
});

export const downloadRequestSchema = z.object({
  productId: z.string().min(1),
  /** If set, request a signed link for just this one file instead of all download files. */
  fileId: z.string().min(1).optional(),
});

export const surveySubmitSchema = z.object({
  productId: z.string().min(1),
  answers: z.record(z.string(), z.string()).default({}),
});

export const emailSchema = z.object({
  email: z.string().email(),
});

export const adminProductSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(PRODUCT_TYPES),
  resolution: z.string().min(1),
  fileFormat: z.string().min(1),
  deviceType: z.string().min(1),
  previewImageSeed: z.string().min(1),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categorySlugs: z.array(z.string()).default([]),
  tagNames: z.array(z.string()).default([]),
  downloadFiles: z
    .array(z.object({ seed: z.string().min(1), label: z.string().optional() }))
    .max(2, "At most 2 download files are supported")
    .default([]),
  unlockRequirements: z
    .array(
      z.object({
        method: z.enum(UNLOCK_METHODS),
        enabled: z.boolean(),
        targetCount: z.number().int().min(1),
      })
    )
    .refine((reqs) => reqs.some((r) => r.enabled), {
      message: "At least one unlock method must be enabled",
    }),
});
