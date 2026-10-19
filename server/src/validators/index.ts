import { z } from "zod";

// Contact form validator
export const contactFormSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล").max(100, "ชื่อยาวเกินไป"),
  phone: z
    .string()
    .min(9, "เบอร์โทรศัพท์ต้องมีอย่างน้อย 9-10 หลัก")
    .max(10, "เบอร์โทรศัพท์ไม่เกิน 10 หลัก")
    .regex(/^[0-9]+$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").optional().or(z.literal("")),
  subject: z.string().max(200, "หัวข้อยาวเกินไป").optional().or(z.literal("")),
  message: z.string().min(1, "กรุณากรอกข้อความ").max(1000, "ข้อความยาวเกิน 1,000 ตัวอักษร"),
});

// Admin login validator
export const loginSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

// Settings validator
export const settingsSchema = z.object({
  shopName: z.string().min(1, "กรุณากรอกชื่อร้าน"),
  logoUrl: z.string().url("กรุณากรอก URL โลโก้ที่ถูกต้อง"),
  phone: z.string().min(1, "กรุณากรอกเบอร์โทรศัพท์"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  address: z.string().min(1, "กรุณากรอกที่อยู่"),
  openingHours: z.string().min(1, "กรุณากรอกเวลาทำการ"),
  lineUrl: z.string().url("กรุณากรอก URL LINE ที่ถูกต้อง"),
  facebookUrl: z.string().url("กรุณากรอก URL Facebook ที่ถูกต้อง"),
  instagramUrl: z.string().url("กรุณากรอก URL Instagram ที่ถูกต้อง"),
  mapUrl: z.string().min(1, "กรุณากรอก URL แผนที่ Google Maps"),
});

// Page update validator
export const pageUpdateSchema = z.object({
  seoTitle: z.string().min(1, "กรุณากรอก SEO Title"),
  seoDescription: z.string().min(1, "กรุณากรอก SEO Description"),
  ogImageUrl: z.string().url("กรุณากรอก OG Image URL ที่ถูกต้อง"),
  content: z.record(z.string(), z.any()),
});

// Category validator
export const categorySchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่"),
  slug: z.string().min(1, "กรุณากรอก Slug"),
  sortOrder: z.number().int().default(0),
});

// Service validator
export const serviceSchema = z.object({
  categoryId: z.number().int().positive("กรุณาเลือกหมวดหมู่"),
  name: z.string().min(1, "กรุณากรอกชื่อบริการ"),
  description: z.string().min(1, "กรุณากรอกรายละเอียดบริการ"),
  price: z.string().nullable().optional(),
  imageUrl: z.string().url("กรุณากรอก Image URL ที่ถูกต้อง"),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
