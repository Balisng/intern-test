# 📱 STARTER - TechFix Pro (ศูนย์ซ่อมมือถือด่วนครบวงจร)

โปรเจกต์ฝึกงานเว็บไซต์แพ็กเกจ **STARTER** พัฒนาแบบ Fullstack (หน้าบ้าน Public + หลังบ้าน Admin + ฐานข้อมูล PostgreSQL) ตามข้อกำหนด

---

## 📋 1. ข้อมูลสังเขปธุรกิจ (Business Brief & Brand)
* **ชื่อแบรนด์:** TechFix Pro
* **สโลแกน:** Fast, Transparent & Certified Mobile Care (ซ่อมด่วน โปร่งใส ได้มาตรฐาน)
* **กลุ่มลูกค้าเป้าหมาย:** บุคคลทั่วไป นักศึกษา วัยทำงาน และเจ้าของธุรกิจที่ต้องการซ่อมด่วน ตรวจเช็กฟรี นั่งรอรับเครื่องได้ใน 30 นาที
* **โทนสีหลัก (Brand Colors):**
  * `Primary Dark / Slate`: `#020617` (Deep Dark Navy)
  * `Primary Blue`: `#2563EB` (Tech Blue)
  * `Accent Cyan`: `#06B6D4` (Electric Cyan)
* **สินค้า/บริการ (6 รายการ):**
  1. เปลี่ยนหน้าจอแท้ OLED / Retina คมชัดระดับโปร (เริ่มต้น ฿2,500)
  2. เปลี่ยนแบตเตอรี่แท้ มาตรฐาน มอก. สุขภาพแบต 100% (เริ่มต้น ฿1,290)
  3. ซ่อมเมนบอร์ด / ชิปไอซี / เครื่องเปิดไม่ติด (เริ่มต้น ฿1,800)
  4. เปลี่ยนกระจกฝาหลังด้วยเลเซอร์ความแม่นยำสูง (เริ่มต้น ฿1,500)
  5. ฟื้นฟูเครื่องตกน้ำ วงจรช็อต อบไล่ความชื้นสุญญากาศ (เริ่มต้น ฿990)
  6. กู้ข้อมูลสำคัญ / แก้ไขอาการเครื่องบูตค้าง Bootloop (เริ่มต้น ฿890)

---

## 🛠️ 2. Tech Stack ที่ใช้
* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router
* **Backend:** Bun 1.4 + Hono Framework
* **Database & ORM:** PostgreSQL 18 + Drizzle ORM + drizzle-kit
* **Validation:** Zod (ตรวจสอบทั้งฝั่ง Frontend และ Backend)
* **Security & Auth:** JWT เก็บใน `httpOnly cookie` (SameSite=Lax), รหัสผ่าน hash ด้วย `Bun.password` (bcrypt)
* **Protection:** In-memory Rate Limiting (5 requests / 10 นาที / IP) บน Contact Form

---

## 🚀 3. ขั้นตอนการติดตั้งและการเปิดใช้งาน (Setup & How to Run)

### ความต้องการของระบบ (Prerequisites)
1. **Node.js** (v18+) และ **npm**
2. **Bun** (v1.1 ขึ้นไป)
3. **PostgreSQL** กำลังรันอยู่ที่ port 5432 (ฐานข้อมูลชื่อ `starter_db`)

---

### ขั้นตอนที่ 1: ตั้งค่าฐานข้อมูลและรัน Backend Server
```bash
# 1. เข้าไปที่โฟลเดอร์ server
cd server

# 2. คัดลอกไฟล์ .env.example ไปเป็น .env และแก้ไขรหัสผ่าน PostgreSQL ของเครื่องคุณ
# (ไฟล์ .env ถูกตั้งค่า DATABASE_URL=postgres://postgres:1234@localhost:5432/starter_db ไว้แล้ว)

# 3. รัน migration โครงสร้างฐานข้อมูล Drizzle
bun run db:push

# 4. รัน seed ข้อมูลตั้งต้น (Admin 1, Settings 1, Pages 3, Categories 3, Services 6)
bun run seed

# 5. เริ่มรัน Backend Server (พอร์ต 3000)
bun run dev
```
เซิร์ฟเวอร์จะเปิดที่ `http://localhost:3000`

---

### ขั้นตอนที่ 2: รัน Frontend Client
เปิด Terminal ใหม่อีกหน้าต่างหนึ่ง:
```bash
# 1. เข้าไปที่โฟลเดอร์ client
cd client

# 2. เริ่มรันเซิร์ฟเวอร์สำหรับพัฒนา (Vite)
npm run dev
```
เว็บแอปจะพร้อมใช้งานที่ `http://localhost:5173`

---

## 🔐 4. ข้อมูลบัญชีผู้ดูแลระบบสำหรับทดสอบ (Test Admin Account)
* **URL หน้าเข้าสู่ระบบ:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
* **Email:** `admin@techfixpro.com`
* **Password:** `Admin1234!`

---

## 🔍 5. การทำ SEO ใน React SPA (ข้อจำกัด & แนวทางแก้ไข)

### ทำไม React SPA จึงทำ SEO ได้จำกัด?
React SPA (Single Page Application) แสดงผลผ่าน Client-Side Rendering (CSR) โดยในไฟล์ `index.html` เริ่มต้นจะมีเพียง `<div id="root"></div>` ว่างเปล่า และตัวเบราว์เซอร์จะต้องดาวน์โหลดโค้ด JavaScript ไปรันก่อนจึงจะเกิดเนื้อหาและ DOM ขึ้นมา

แม้ Search Engine สมัยใหม่อย่าง Googlebot จะสามารถรัน JavaScript ได้ในปัจจุบัน แต่ยังมีข้อจำกัด:
1. Web Crawlers ของแพลตฟอร์มโซเชียลมีเดียหลายตัว (เช่น LINE, Facebook, Twitter, Telegram) จะไม่รัน JavaScript เมื่อมีคนแชร์ลิงก์ ทำให้ไม่สามารถดึง Title, Description หรือภาพ OG Image ที่เปลี่ยนแบบไดนามิกได้
2. มีค่าใช้จ่ายด้าน Crawl Budget และอาจเกิดความล่าช้าในการทำดัชนี (Indexing Delay)

### หากต้องการแก้ไขให้ได้ SEO ระดับ 100% ต้องทำอย่างไร?
1. **Server-Side Rendering (SSR):** ย้ายไปใช้ Framework อย่าง Next.js หรือ Remix เพื่อให้ Server ทำการ Render HTML พร้อมข้อมูลและ Meta Tags จากฐานข้อมูลส่งตรงไปยังเบราว์เซอร์และบอตทันที
2. **Prerendering / Static Site Generation (SSG):** บิลด์หน้าเพจ Public (เช่น Home, About, Contact) ให้เป็นไฟล์ HTML สำเร็จรูปล่วงหน้า
3. **Dynamic Rendering (Edge Prerender):** ใช้ Middleware บน CDN (เช่น Cloudflare Workers) ตรวจจับ User-Agent หากเป็นบอต (เช่น line-poker, facebookexternalhit) ให้ส่งหน้า HTML ที่เรนเดอร์สำเร็จรูปไปให้แทน
