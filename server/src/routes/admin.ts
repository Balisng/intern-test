import { Hono } from "hono";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../db";
import { admins, categories, contactMessages, pages, services, siteSettings } from "../db/schema";
import {
  categorySchema,
  loginSchema,
  pageUpdateSchema,
  serviceSchema,
  settingsSchema,
} from "../validators";
import {
  authMiddleware,
  clearAuthCookie,
  createAuthToken,
  setAuthCookie,
  type TokenPayload,
} from "../middleware/auth";

type Variables = {
  user: TokenPayload;
};

export const adminRoutes = new Hono<{ Variables: Variables }>();

// ==========================================
// 1. Auth routes (public endpoints)
// ==========================================

// POST /api/admin/login
adminRoutes.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          details: {},
        },
      },
      401
    );
  }

  const { email, password } = parsed.data;
  const user = await db.select().from(admins).where(eq(admins.email, email.trim())).limit(1);
  const adminUser = user[0];

  if (!adminUser) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          details: {},
        },
      },
      401
    );
  }

  const isPasswordValid = await Bun.password.verify(password, adminUser.passwordHash);
  if (!isPasswordValid) {
    return c.json(
      {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          details: {},
        },
      },
      401
    );
  }

  const tokenPayload = {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
  };

  const token = await createAuthToken(tokenPayload);
  setAuthCookie(c, token);

  return c.json({
    success: true,
    data: {
      user: tokenPayload,
      message: "เข้าสู่ระบบสำเร็จ",
    },
  });
});

// POST /api/admin/logout
adminRoutes.post("/logout", async (c) => {
  clearAuthCookie(c);
  return c.json({
    success: true,
    data: { message: "ออกจากระบบเรียบร้อยแล้ว" },
  });
});

// ==========================================
// Protected Routes (Require Authentication)
// ==========================================
adminRoutes.use("/*", authMiddleware);

// GET /api/admin/me
adminRoutes.get("/me", async (c) => {
  const user = c.get("user");
  return c.json({
    success: true,
    data: user,
  });
});

// GET /api/admin/dashboard
adminRoutes.get("/dashboard", async (c) => {
  const [unreadMsg] = await db
    .select({ count: count() })
    .from(contactMessages)
    .where(eq(contactMessages.isRead, false));

  const [totalServices] = await db.select({ count: count() }).from(services);

  const recentMessages = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(5);

  return c.json({
    success: true,
    data: {
      unreadMessagesCount: Number(unreadMsg?.count || 0),
      totalServicesCount: Number(totalServices?.count || 0),
      recentMessages,
    },
  });
});

// PUT /api/admin/settings
adminRoutes.put("/settings", async (c) => {
  const body = await c.req.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "ข้อมูลการตั้งค่าเว็บไซต์ไม่ถูกต้อง",
          details: parsed.error.flatten().fieldErrors,
        },
      },
      400
    );
  }

  const existing = await db.select().from(siteSettings).limit(1);
  const firstExisting = existing[0];
  let updated;

  if (!firstExisting) {
    updated = await db.insert(siteSettings).values(parsed.data).returning();
  } else {
    updated = await db
      .update(siteSettings)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, firstExisting.id))
      .returning();
  }

  return c.json({
    success: true,
    data: updated[0],
  });
});

// PUT /api/admin/pages/:slug
adminRoutes.put("/pages/:slug", async (c) => {
  const slug = c.req.param("slug");
  const body = await c.req.json();
  const parsed = pageUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "ข้อมูลหน้าเว็บไม่ถูกต้อง",
          details: parsed.error.flatten().fieldErrors,
        },
      },
      400
    );
  }

  const existing = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);

  let result;
  if (existing.length === 0) {
    result = await db
      .insert(pages)
      .values({
        slug,
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        ogImageUrl: parsed.data.ogImageUrl,
        content: parsed.data.content,
      })
      .returning();
  } else {
    result = await db
      .update(pages)
      .set({
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        ogImageUrl: parsed.data.ogImageUrl,
        content: parsed.data.content,
        updatedAt: new Date(),
      })
      .where(eq(pages.slug, slug))
      .returning();
  }

  return c.json({
    success: true,
    data: result[0],
  });
});

// ==========================================
// Category CRUD
// ==========================================

// GET /api/admin/categories
adminRoutes.get("/categories", async (c) => {
  const result = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  return c.json({ success: true, data: result });
});

// POST /api/admin/categories
adminRoutes.post("/categories", async (c) => {
  const body = await c.req.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "ข้อมูลหมวดหมู่ไม่ถูกต้อง",
          details: parsed.error.flatten().fieldErrors,
        },
      },
      400
    );
  }

  const existing = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, parsed.data.slug))
    .limit(1);

  if (existing.length > 0) {
    return c.json(
      {
        success: false,
        error: {
          code: "CONFLICT",
          message: `Slug '${parsed.data.slug}' มีอยู่ในระบบแล้ว`,
          details: {},
        },
      },
      409
    );
  }

  const inserted = await db.insert(categories).values(parsed.data).returning();
  return c.json({ success: true, data: inserted[0] }, 201);
});

// PATCH /api/admin/categories/:id
adminRoutes.patch("/categories/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json(
      { success: false, error: { code: "BAD_REQUEST", message: "รหัสหมวดหมู่ไม่ถูกต้อง", details: {} } },
      400
    );
  }

  const body = await c.req.json();
  const updated = await db
    .update(categories)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning();

  if (updated.length === 0) {
    return c.json(
      { success: false, error: { code: "NOT_FOUND", message: "ไม่พบหมวดหมู่นี้", details: {} } },
      404
    );
  }

  return c.json({ success: true, data: updated[0] });
});

// DELETE /api/admin/categories/:id
adminRoutes.delete("/categories/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json(
      { success: false, error: { code: "BAD_REQUEST", message: "รหัสหมวดหมู่ไม่ถูกต้อง", details: {} } },
      400
    );
  }

  // Check if services exist under this category
  const [servicesCount] = await db
    .select({ count: count() })
    .from(services)
    .where(eq(services.categoryId, id));

  const totalLinked = servicesCount?.count ? Number(servicesCount.count) : 0;
  if (totalLinked > 0) {
    return c.json(
      {
        success: false,
        error: {
          code: "CATEGORY_IN_USE",
          message: "ไม่สามารถลบหมวดหมู่นี้ได้ เนื่องจากยังมีบริการผูกอยู่ กรุณาย้ายหรือลบบริการออกก่อน",
          details: { servicesCount: totalLinked },
        },
      },
      409
    );
  }

  const deleted = await db.delete(categories).where(eq(categories.id, id)).returning();
  if (deleted.length === 0) {
    return c.json(
      { success: false, error: { code: "NOT_FOUND", message: "ไม่พบหมวดหมู่นี้", details: {} } },
      404
    );
  }

  return c.json({
    success: true,
    data: { message: "ลบหมวดหมู่เรียบร้อยแล้ว", id },
  });
});

// ==========================================
// Service CRUD
// ==========================================

// GET /api/admin/services?q=&category=&page=
adminRoutes.get("/services", async (c) => {
  const q = c.req.query("q")?.trim() || "";
  const categoryParam = c.req.query("category");
  const page = Math.max(1, Number(c.req.query("page")) || 1);
  const limit = Math.max(1, Number(c.req.query("limit")) || 10);
  const offset = (page - 1) * limit;

  const conditions = [];

  if (q) {
    conditions.push(ilike(services.name, `%${q}%`));
  }

  if (categoryParam) {
    const numId = Number(categoryParam);
    if (!isNaN(numId)) {
      conditions.push(eq(services.categoryId, numId));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult] = await db
    .select({ count: count() })
    .from(services)
    .where(whereClause);

  const total = Number(totalResult?.count || 0);

  const rows = await db
    .select({
      id: services.id,
      categoryId: services.categoryId,
      categoryName: categories.name,
      name: services.name,
      description: services.description,
      price: services.price,
      imageUrl: services.imageUrl,
      isFeatured: services.isFeatured,
      isActive: services.isActive,
      sortOrder: services.sortOrder,
      createdAt: services.createdAt,
      updatedAt: services.updatedAt,
    })
    .from(services)
    .leftJoin(categories, eq(services.categoryId, categories.id))
    .where(whereClause)
    .orderBy(asc(services.sortOrder), desc(services.id))
    .limit(limit)
    .offset(offset);

  return c.json({
    success: true,
    data: rows,
    meta: {
      page,
      limit,
      total,
    },
  });
});

// POST /api/admin/services
adminRoutes.post("/services", async (c) => {
  const body = await c.req.json();
  const parsed = serviceSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "ข้อมูลบริการไม่ถูกต้อง",
          details: parsed.error.flatten().fieldErrors,
        },
      },
      400
    );
  }

  const inserted = await db
    .insert(services)
    .values({
      ...parsed.data,
      price: parsed.data.price || null,
    })
    .returning();

  return c.json({ success: true, data: inserted[0] }, 201);
});

// PATCH /api/admin/services/:id
adminRoutes.patch("/services/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json(
      { success: false, error: { code: "BAD_REQUEST", message: "รหัสบริการไม่ถูกต้อง", details: {} } },
      400
    );
  }

  const body = await c.req.json();
  const updated = await db
    .update(services)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(services.id, id))
    .returning();

  if (updated.length === 0) {
    return c.json(
      { success: false, error: { code: "NOT_FOUND", message: "ไม่พบบริการนี้", details: {} } },
      404
    );
  }

  return c.json({ success: true, data: updated[0] });
});

// DELETE /api/admin/services/:id
adminRoutes.delete("/services/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json(
      { success: false, error: { code: "BAD_REQUEST", message: "รหัสบริการไม่ถูกต้อง", details: {} } },
      400
    );
  }

  const deleted = await db.delete(services).where(eq(services.id, id)).returning();
  if (deleted.length === 0) {
    return c.json(
      { success: false, error: { code: "NOT_FOUND", message: "ไม่พบบริการนี้", details: {} } },
      404
    );
  }

  return c.json({
    success: true,
    data: { message: "ลบบริการเรียบร้อยแล้ว", id },
  });
});

// ==========================================
// Contact Messages
// ==========================================

// GET /api/admin/messages
adminRoutes.get("/messages", async (c) => {
  const rows = await db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));

  return c.json({
    success: true,
    data: rows,
  });
});

// GET /api/admin/messages/:id (mark as read)
adminRoutes.get("/messages/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json(
      { success: false, error: { code: "BAD_REQUEST", message: "รหัสข้อความไม่ถูกต้อง", details: {} } },
      400
    );
  }

  // Update is_read = true automatically
  const updated = await db
    .update(contactMessages)
    .set({
      isRead: true,
      updatedAt: new Date(),
    })
    .where(eq(contactMessages.id, id))
    .returning();

  if (updated.length === 0) {
    return c.json(
      { success: false, error: { code: "NOT_FOUND", message: "ไม่พบข้อความนี้", details: {} } },
      404
    );
  }

  return c.json({
    success: true,
    data: updated[0],
  });
});

// DELETE /api/admin/messages/:id
adminRoutes.delete("/messages/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json(
      { success: false, error: { code: "BAD_REQUEST", message: "รหัสข้อความไม่ถูกต้อง", details: {} } },
      400
    );
  }

  const deleted = await db
    .delete(contactMessages)
    .where(eq(contactMessages.id, id))
    .returning();

  if (deleted.length === 0) {
    return c.json(
      { success: false, error: { code: "NOT_FOUND", message: "ไม่พบข้อความนี้", details: {} } },
      404
    );
  }

  return c.json({
    success: true,
    data: { message: "ลบข้อความเรียบร้อยแล้ว", id },
  });
});
