import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import type { User } from "@prisma/client";

/** Reads the anonymous session id from the cookie set by middleware. Read-only, no DB access. */
export function getSessionId(): string | null {
  return cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
}

/**
 * Looks up the User row for the current session without creating one.
 * Use this for read-only pages (e.g. viewing a product) so browsing never
 * writes to the database.
 */
export async function getSessionUser(): Promise<User | null> {
  const sessionId = getSessionId();
  if (!sessionId) return null;
  return prisma.user.findUnique({ where: { sessionId } });
}

/**
 * Lazily creates the User row for the current session on first write
 * (saving a product, starting an unlock, creating a referral, setting an email).
 */
export async function getOrCreateSessionUser(): Promise<User> {
  const sessionId = getSessionId();
  if (!sessionId) {
    throw new Error(
      "No session cookie present — middleware should have set one on every request."
    );
  }
  return prisma.user.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
  });
}
