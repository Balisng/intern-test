import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { publicRoutes } from "./routes/public";
import { adminRoutes } from "./routes/admin";
import { errorHandler } from "./middleware/error";

const app = new Hono();

// Global Middlewares
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Global Error Handler
app.onError(errorHandler);

// API Routes
app.route("/api", publicRoutes);
app.route("/api/admin", adminRoutes);

// 404 handler for unknown API routes
app.all("*", (c) => {
  return c.json(
    {
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `ไม่พบ endpoint '${c.req.path}' บนเซิร์ฟเวอร์`,
        details: {},
      },
    },
    404
  );
});

const port = Number(process.env.PORT) || 3000;
console.log(`🚀 TechFix Pro Backend Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
