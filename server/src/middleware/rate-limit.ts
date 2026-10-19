import type { Context, Next } from "hono";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipMap.entries()) {
    if (record.resetAt <= now) {
      ipMap.delete(ip);
    }
  }
}, 60000);

export function rateLimiter(maxRequests = 5, windowMs = 10 * 60 * 1000) {
  return async (c: Context, next: Next) => {
    const forwarded = c.req.header("x-forwarded-for");
    const ip =
      (forwarded ? forwarded.split(",")[0]?.trim() : null) ||
      c.req.header("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    let record = ipMap.get(ip);

    if (!record || record.resetAt <= now) {
      record = { count: 1, resetAt: now + windowMs };
      ipMap.set(ip, record);
    } else {
      record.count++;
    }

    if (record.count > maxRequests) {
      return c.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "ส่งข้อความบ่อยเกินไป กรุณารอ 10 นาทีแล้วลองใหม่อีกครั้ง",
            details: {},
          },
        },
        429
      );
    }

    await next();
  };
}
