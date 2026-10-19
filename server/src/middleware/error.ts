import type { ErrorHandler } from "hono";
import { ZodError } from "zod";

export const errorHandler: ErrorHandler = (err, c) => {
  console.error("🔥 Error caught by global handler:", err);

  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const path = issue.path.join(".") || "general";
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }

    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "ข้อมูลที่ส่งมาไม่ถูกต้องตามเงื่อนไข",
          details,
        },
      },
      400
    );
  }

  // Generic 500 internal server error without stack trace
  return c.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "เกิดข้อผิดพลาดภายในระบบ กรุณาลองใหม่อีกครั้ง",
        details: {},
      },
    },
    500
  );
};
