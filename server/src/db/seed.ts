import { eq } from "drizzle-orm";
import { db } from "./index";
import { admins, siteSettings, pages, categories, services } from "./schema";

async function seed() {
  console.log("🌱 Starting seed...");

  // 1. Seed admin
  console.log("Creating admin...");
  const existingAdmin = await db.select().from(admins).limit(1);
  if (existingAdmin.length === 0) {
    const passwordHash = await Bun.password.hash("Admin1234!", {
      algorithm: "bcrypt",
      cost: 10,
    });
    await db.insert(admins).values({
      email: "admin@techfixpro.com",
      passwordHash,
      name: "ผู้ดูแลระบบ TechFix Pro",
    });
    console.log("✓ Admin created: admin@techfixpro.com (Password: Admin1234!)");
  } else {
    console.log("Admin already exists, skipping...");
  }

  // 2. Seed site settings
  console.log("Creating site settings...");
  const existingSettings = await db.select().from(siteSettings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      shopName: "TechFix Pro - ศูนย์ซ่อมมือถือด่วนครบวงจร",
      logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80",
      phone: "081-234-5678",
      email: "support@techfixpro.com",
      address: "99/1 อาคารไอทีมอลล์ ชั้น 2 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310",
      openingHours: "จันทร์ - เสาร์ 10:00 - 20:00 น. (หยุดทุกวันอาทิตย์)",
      lineUrl: "https://line.me/ti/p/@techfixpro",
      facebookUrl: "https://facebook.com/techfixpro",
      instagramUrl: "https://instagram.com/techfixpro",
      mapUrl: "https://maps.google.com/maps?q=Central%20Rama%209&t=&z=15&ie=UTF8&iwloc=&output=embed",
    });
    console.log("✓ Site settings created");
  }

  // 3. Seed pages (home, about, contact)
  console.log("Creating pages...");
  const pageConfigs = [
    {
      slug: "home",
      seoTitle: "TechFix Pro | ศูนย์บริการซ่อมมือถือด่วน อะไหล่แท้ รับประกันสูงสุด 1 ปี",
      seoDescription: "บริการซ่อมมือถือด่วน เปลี่ยนจอแท้ แบตเตอรี่ มอก. ซ่อมบอร์ด ตรวจเช็กฟรี รอรับได้ใน 30 นาที โดยช่างมืออาชีพ",
      ogImageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80",
      content: {
        heroTitle: "ศูนย์ซ่อมมือถือด่วน วินิจฉัยฟรี รอรับได้ใน 30 นาที",
        heroSubtitle: "บริการตรวจเช็กและซ่อมแซมสมาร์ตโฟน iPhone, Samsung, iPad อะไหล่แท้เกรดพรีเมียม รับประกันงานซ่อมสูงสุด 1 ปีเต็ม พร้อมทีมช่างมืออาชีพ",
        heroImageUrl: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80",
        ctaText: "ปรึกษาช่างและประเมินราคาฟรี",
        features: [
          {
            icon: "ShieldCheck",
            title: "อะไหล่แท้ & มาตรฐาน มอก.",
            description: "คัดสรรอะไหล่คุณภาพสูง หน้าจอสีตรง ทัชลื่น แบตเตอรี่เก็บประจุเต็มความจุ ปลอดภัย 100%"
          },
          {
            icon: "Clock",
            title: "ซ่อมด่วน รอรับได้ใน 30 นาที",
            description: "งานซ่อมทั่วไป เช่น เปลี่ยนหน้าจอ เปลี่ยนแบตเตอรี่ หรือกล้องหลัง สามารถนั่งรอรับกลับได้เลย"
          },
          {
            icon: "Award",
            title: "รับประกันงานซ่อมสูงสุด 1 ปี",
            description: "สบายใจทุกบริการ พร้อมเอกสารใบรับประกันชัดเจน มีปัญหาเคลมได้ทันทีโดยไม่มีเงื่อนไขยุ่งยาก"
          },
          {
            icon: "Cpu",
            title: "เครื่องมือระดับแล็บมาตรฐานสากล",
            description: "ใช้เครื่องเลเซอร์แยกกระจก ตู้อบสุญญากาศไร้ฝุ่น และกล้องไมโครสโคปซ่อมงานบอร์ดระดับไมโคร"
          }
        ]
      }
    },
    {
      slug: "about",
      seoTitle: "เกี่ยวกับเรา | TechFix Pro ศูนย์ซ่อมมือถือผู้เชี่ยวชาญกว่า 12 ปี",
      seoDescription: "ทำความรู้จักกับ TechFix Pro ทีมช่างมืออาชีพที่ได้รับใบรับรอง พร้อมเครื่องมือทันสมัยและอะไหล่มาตรฐานสากล",
      ogImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      content: {
        aboutTitle: "มุ่งมั่นส่งมอบบริการซ่อมที่โปร่งใส ซื่อตรง และมีมาตรฐานสูงสุด",
        aboutContent: "TechFix Pro ก่อตั้งขึ้นจากความมุ่งมั่นที่จะยกระดับมาตรฐานร้านซ่อมสมาร์ตโฟนในประเทศไทย เราเชื่อมั่นว่าสมาร์ตโฟนคืออุปกรณ์สำคัญที่สุดในชีวิตประจำวันของทุกคน ดังนั้นทุกงานซ่อมของเราจึงให้บริการในโซนเปิดที่ลูกค้าสามารถมองเห็นการทำงานของช่างได้ตลอดเวลา ตรวจสอบอะไหล่ก่อนการติดตั้งจริง แจ้งราคาก่อนเริ่มงานชัดเจน และไม่มีค่าใช้จ่ายแอบแฝงใดๆ ทั้งสิ้น",
        aboutImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
        experienceYears: 12,
        stats: [
          { label: "เครื่องที่ผ่านการซ่อมสำเร็จ", value: "25,000+" },
          { label: "คะแนนรีวิวจากลูกค้าจริง", value: "4.9 / 5.0" },
          { label: "ช่างเทคนิคระดับผู้เชี่ยวชาญ", value: "8 คน" },
          { label: "ระยะเวลารับประกันสูงสุด", value: "365 วัน" }
        ]
      }
    },
    {
      slug: "contact",
      seoTitle: "ติดต่อเรา | TechFix Pro สาขาไอทีมอลล์ พระราม 9 ปรึกษาฟรี",
      seoDescription: "ติดต่อสอบถามราคาซ่อมมือถือ เช็กสาขา และจองคิวตรวจเช็กเครื่องล่วงหน้าฟรี โทร 081-234-5678 หรือทัก LINE @techfixpro",
      ogImageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      content: {
        contactNote: "ยินดีให้คำปรึกษาและตรวจเช็กสภาพเครื่องฟรีทุกรุ่น ไม่มีค่าเปิดเครื่องแม้ลูกค้าตัดสินใจยังไม่ส่งซ่อม",
        emergencyPhone: "081-234-5678",
        directions: "ร้านตั้งอยู่ชั้น 2 อาคารไอทีมอลล์ พระราม 9 ติดทางเชื่อม MRT สถานีพระราม 9 ประตู 1 มีที่จอดรถสะดวกสบาย"
      }
    }
  ];

  for (const page of pageConfigs) {
    const existing = await db.select().from(pages).where(eq(pages.slug, page.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(pages).values(page);
      console.log(`✓ Page '${page.slug}' created`);
    }
  }

  // 4. Seed categories
  console.log("Creating categories...");
  const cat1 = await db.insert(categories).values({
    name: "บริการเปลี่ยนอะไหล่ภายนอก",
    slug: "hardware-replacement",
    sortOrder: 1,
  }).onConflictDoNothing().returning();

  const cat2 = await db.insert(categories).values({
    name: "บริการซ่อมบอร์ดและวงจรเชิงลึก",
    slug: "board-microsoldering",
    sortOrder: 2,
  }).onConflictDoNothing().returning();

  const cat3 = await db.insert(categories).values({
    name: "บริการซอฟต์แวร์และกู้ข้อมูล",
    slug: "software-recovery",
    sortOrder: 3,
  }).onConflictDoNothing().returning();

  const allCats = await db.select().from(categories);
  const hardwareCatId = allCats.find(c => c.slug === "hardware-replacement")?.id || 1;
  const boardCatId = allCats.find(c => c.slug === "board-microsoldering")?.id || 2;
  const softwareCatId = allCats.find(c => c.slug === "software-recovery")?.id || 3;

  // 5. Seed services (6 รายการ)
  console.log("Creating services...");
  const serviceList = [
    {
      categoryId: hardwareCatId,
      name: "เปลี่ยนหน้าจอแท้ OLED / Retina คมชัดระดับโปร",
      description: "เปลี่ยนชุดหน้าจอใหม่เกรดศูนย์ สีสันคมชัด อัตราตอบสนองลื่นไหล ทัชไม่สะดุด พร้อมทรูโทน (True Tone) รับประกัน 6 เดือน",
      price: "2500.00",
      imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      isActive: true,
      sortOrder: 1,
    },
    {
      categoryId: hardwareCatId,
      name: "เปลี่ยนแบตเตอรี่แท้ มาตรฐาน มอก. สุขภาพแบต 100%",
      description: "แบตเตอรี่มาตรฐานอุตสาหกรรม มอก. เก็บไฟอึด ไม่บวม ปลอดภัย พร้อมตรวจเช็กรอบชาร์จและกระแสไฟ รับประกันเต็ม 1 ปี",
      price: "1290.00",
      imageUrl: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      isActive: true,
      sortOrder: 2,
    },
    {
      categoryId: boardCatId,
      name: "ซ่อมเมนบอร์ด / ชิปไอซี / เครื่องเปิดไม่ติด ชาร์จไม่เข้า",
      description: "วิเคราะห์จุดช็อตบนเมนบอร์ดด้วยกล้องความร้อนและไมโครสโคป เปลี่ยนชิป IC Power, Audio IC, Touch IC โดยช่างเฉพาะทาง",
      price: "1800.00",
      imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80",
      isFeatured: true,
      isActive: true,
      sortOrder: 3,
    },
    {
      categoryId: hardwareCatId,
      name: "เปลี่ยนกระจกฝาหลังด้วยเทคโนโลยีเลเซอร์ความแม่นยำสูง",
      description: "ยิงเลเซอร์ลอกฝาหลังอย่างประณีตโดยไม่ต้องแกะเครื่องด้านใน ป้องกันชิ้นส่วนภายในเสียหาย กระจกเนียนกริบเหมือนเครื่องใหม่",
      price: "1500.00",
      imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 4,
    },
    {
      categoryId: boardCatId,
      name: "ฟื้นฟูเครื่องตกน้ำ วงจรช็อต อบไล่ความชื้นระบบสุญญากาศ",
      description: "ทำความสะอาดคราบออกไซด์ อบไล่ความชื้นในตู้อบสุญญากาศ และตรวจเช็กวงจรไฟอย่างละเอียดเพื่อป้องกันเครื่องดับถาวร",
      price: "990.00",
      imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 5,
    },
    {
      categoryId: softwareCatId,
      name: "กู้ข้อมูลสำคัญ / แก้ไขอาการเครื่องบูตค้าง Bootloop",
      description: "กู้คืนรูปภาพ ไฟล์เอกสาร แชตไลน์จากเครื่องที่เปิดไม่ติด หรือแก้ไขอาการเครื่องค้างหน้าโลโก้ อัปเดตเฟิร์มแวร์อย่างปลอดภัย",
      price: "890.00",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 6,
    },
  ];

  const existingServices = await db.select().from(services);
  if (existingServices.length === 0) {
    for (const svc of serviceList) {
      await db.insert(services).values(svc);
    }
    console.log("✓ 6 Services seeded successfully");
  }

  console.log("🎉 Seed finished successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
