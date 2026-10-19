import type { Context, Next } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "techfix_pro_secret_key_2026_secure";
const COOKIE_NAME = "token";

export interface TokenPayload {
  id: number;
  email: string;
  name: string;
  exp?: number;
}

export async function createAuthToken(payload: { id: number; email: string; name: string }) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1 day
  return await sign({ ...payload, exp }, JWT_SECRET);
}

export function setAuthCookie(c: Context, token: string) {
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
}

export function clearAuthCookie(c: Context) {
  deleteCookie(c, COOKIE_NAME, {
    path: "/",
  });
}

export async function authMiddleware(c: Context, next: Next) {
  const token = getCookie(c, COOKIE_NAME);

  if (!token) {
    return c.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
          details: {},
        },
      },
      401
    );
  }

  try {
    const payload = (await verify(token, JWT_SECRET, "HS256")) as unknown as TokenPayload;
    c.set("user", payload);
    await next();
  } catch (err) {
    return c.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Session หมดอายุหรือโทเคนไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่",
          details: {},
        },
      },
      401
    );
  }
}
