import { Hono } from "hono";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../db";
import { categories, contactMessages, pages, services, siteSettings } from "../db/schema";
import { contactFormSchema } from "../validators";
import { rateLimiter } from "../middleware/rate-limit";

export const publicRoutes = new Hono();

// GET /api/settings
publicRoutes.get("/settings", async (c) => {
  const result = await db.select().from(siteSettings).limit(1);
  if (result.length === 0) {
    return c.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "ไม่พบข้อมูลการตั้งค่าเว็บไซต์",
          details: {},
        },
      },
      404
    );
  }
  return c.json({ success: true, data: result[0] });
});

// GET /api/pages/:slug
publicRoutes.get("/pages/:slug", async (c) => {
  const slug = c.req.param("slug");
  const result = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);

  if (result.length === 0) {
    return c.json(
      {
        success: false,
        error: {
          code: "PAGE_NOT_FOUND",
          message: `ไม่พบหน้าเนื้อหา '${slug}'`,
          details: {},
        },
      },
      404
    );
  }

  return c.json({ success: true, data: result[0] });
});

// GET /api/categories
publicRoutes.get("/categories", async (c) => {
  const result = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  return c.json({ success: true, data: result });
});

// GET /api/services?category=&featured=
publicRoutes.get("/services", async (c) => {
  const categoryParam = c.req.query("category");
  const featuredParam = c.req.query("featured");

  const conditions = [eq(services.isActive, true)];

  if (categoryParam) {
    // Check if category is numeric id or slug
    const numId = Number(categoryParam);
    if (!isNaN(numId)) {
      conditions.push(eq(services.categoryId, numId));
    } else {
      const cat = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categoryParam))
        .limit(1);
      const firstCat = cat[0];
      if (firstCat) {
        conditions.push(eq(services.categoryId, firstCat.id));
      } else {
        return c.json({ success: true, data: [] });
      }
    }
  }

  if (featuredParam === "true") {
    conditions.push(eq(services.isFeatured, true));
  }

  const result = await db
    .select({
      id: services.id,
      categoryId: services.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
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
    .where(and(...conditions))
    .orderBy(asc(services.sortOrder), asc(services.id));

  return c.json({ success: true, data: result });
});

// POST /api/contact
publicRoutes.post("/contact", rateLimiter(5, 10 * 60 * 1000), async (c) => {
  const body = await c.req.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".") || "general";
      if (!details[path]) details[path] = [];
      details[path].push(issue.message);
    }
    return c.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง",
          details,
        },
      },
      400
    );
  }

  const inserted = await db
    .insert(contactMessages)
    .values({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    })
    .returning();

  const item = inserted[0];
  return c.json(
    {
      success: true,
      data: {
        id: item?.id ?? 0,
        message: "ส่งข้อความสำเร็จ เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด",
      },
    },
    201
  );
});
