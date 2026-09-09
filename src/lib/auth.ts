import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE_NAME = "earnquest_session";

export interface SessionUser {
  id: string;
  email: string;
  role: string;
  displayName: string;
  level: number;
  xp: number;
  hardwareTier?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<void> {
  const cookieStore = cookies();
  // For standard secure session handling in Next.js
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!userId) return null;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        hardwareProfile: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.profile?.displayName || user.email.split("@")[0],
      level: user.profile?.level || 1,
      xp: user.profile?.xp || 0,
      hardwareTier: user.hardwareProfile?.tier || "TIER_1_LITE",
    };
  } catch {
    return null;
  }
}
