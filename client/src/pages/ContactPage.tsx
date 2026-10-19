import { useEffect, useState } from "react";
import { z } from "zod";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { api } from "../api/client";
import { SEO } from "../components/SEO";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import type { PageContentContact, PageData, SiteSettings } from "../types";

// Client-side Zod validation schema
const contactFormClientSchema = z.object({
  name: z.string().trim().min(1, "กรุณากรอกชื่อ-นามสกุลของคุณ"),
  phone: z
    .string()
    .trim()
    .min(9, "เบอร์โทรศัพท์ต้องมีอย่างน้อย 9 หลัก")
    .max(10, "เบอร์โทรศัพท์ต้องไม่เกิน 10 หลัก")
    .regex(/^[0-9]+$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลข 0-9 เท่านั้น"),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง").optional().or(z.literal("")),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(5, "กรุณากรอกรายละเอียดอาการเสียอย่างน้อย 5 ตัวอักษร"),
});

export function ContactPage({ settings }: { settings?: SiteSettings | null }) {
  const [pageData, setPageData] = useState<PageData<PageContentContact> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPage<PageContentContact>("contact");
      if (res.success) setPageData(res.data);
    } catch (err: any) {
      console.error("Failed to load contact page:", err);
      setError(err?.message || "ไม่สามารถเชื่อมต่อข้อมูลหน้าติดต่อเราได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the current field as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setServerError(null);

    // 1. Client-side validation with Zod
    const validation = contactFormClientSchema.safeParse(formData);
    if (!validation.success) {
      const errs: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const field = issue.path[0] as string;
        if (!errs[field]) {
          errs[field] = issue.message;
        }
      }
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await api.sendContactMessage({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });

      if (res.success) {
        setSubmitSuccess(res.data.message || "ส่งข้อความสำเร็จ! ช่างเทคนิคจะติดต่อกลับโดยเร็วที่สุด");
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setServerError(res.error?.message || "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err: any) {
      console.error("Submit contact form failed:", err);
      setServerError(err?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="กำลังโหลดข้อมูลการติดต่อ..." />;
  }

  if (error || !pageData) {
    return <ErrorMessage message={error || "ไม่พบข้อมูลหน้านี้"} onRetry={fetchData} />;
  }

  const { content } = pageData;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <SEO
        title={pageData.seoTitle}
        description={pageData.seoDescription}
        ogImage={pageData.ogImageUrl}
      />

      {/* Header */}
      <section className="py-16 text-center border-b border-slate-850">
        <div className="max-w-4xl mx-auto px-4">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            ติดต่อและนัดหมาย
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
            ติดต่อสอบถาม & จองคิวซ่อม
          </h1>
          <p className="text-slate-400 text-base mt-3 max-w-2xl mx-auto">
            {content?.contactNote ||
              "ยินดีให้คำปรึกษาและตรวจเช็กอาการเครื่องฟรีทุกรุ่น ไม่มีค่าเปิดเครื่อง"}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Contact Form */}
            <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-2">ส่งข้อความปรึกษาอาการเสีย</h2>
              <p className="text-slate-400 text-sm mb-8">
                กรอกรายละเอียดอาการเสียของเครื่อง หรือสอบถามราคาอะไหล่ ทีมงานจะติดต่อกลับโดยเร็ว
              </p>

              {/* Success Notification */}
              {submitSuccess && (
                <div
                  id="contact-success-alert"
                  className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-start gap-3 animate-in fade-in"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold">ส่งข้อความเรียบร้อยแล้ว!</p>
                    <p className="text-emerald-400/90 mt-0.5">{submitSuccess}</p>
                  </div>
                </div>
              )}

              {/* Server / Rate limit error */}
              {serverError && (
                <div
                  id="contact-error-alert"
                  className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-3 animate-in fade-in"
                >
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold">เกิดข้อผิดพลาด</p>
                    <p className="text-rose-400/90 mt-0.5">{serverError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name field */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                    >
                      ชื่อ-นามสกุล <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="เช่น สมชาย ใจดี"
                      className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.name
                          ? "border-rose-500 focus:ring-rose-500/30"
                          : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                    >
                      เบอร์โทรศัพท์ <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="เช่น 0812345678"
                      className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.phone
                          ? "border-rose-500 focus:ring-rose-500/30"
                          : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email field */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                    >
                      อีเมล (ไม่บังคับ)
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.email
                          ? "border-rose-500 focus:ring-rose-500/30"
                          : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject field */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                    >
                      หัวข้อ / รุ่นมือถือ
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="เช่น iPhone 14 Pro Max จอแตก"
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Message field */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                  >
                    รายละเอียดอาการเสีย / ข้อความ <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="อธิบายอาการเสีย เช่น ตกพื้นแล้วหน้าจอมีเส้นเขียว ทัชไม่ไป หรือแบตเตอรี่หมดไว ฯลฯ"
                    className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      fieldErrors.message
                        ? "border-rose-500 focus:ring-rose-500/30"
                        : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังส่งข้อความ...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>ส่งข้อความสอบถาม</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Contact Info & Google Maps Embed */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
                <h3 className="text-xl font-bold text-white">ข้อมูลร้านและการเดินทาง</h3>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">ที่อยู่ร้าน</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {settings?.address || "99/1 อาคารไอทีมอลล์ ชั้น 2 ถ.พระราม 9 กรุงเทพฯ"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">เบอร์โทรศัพท์ติดต่อ</p>
                      <a
                        href={`tel:${settings?.phone}`}
                        className="text-cyan-400 text-xs hover:underline mt-0.5 block"
                      >
                        {settings?.phone || "081-234-5678"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">เวลาทำการ</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {settings?.openingHours || "จันทร์ - เสาร์ 10:00 - 20:00 น."}
                      </p>
                    </div>
                  </div>
                </div>

                {content?.directions && (
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                    <span className="font-bold text-slate-200 block mb-1">การเดินทางโดยขนส่งสาธารณะ:</span>
                    {content.directions}
                  </div>
                )}
              </div>

              {/* Google Maps Embed iframe */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg h-72">
                <iframe
                  id="google-maps-iframe"
                  title="Google Maps Location"
                  src={
                    settings?.mapUrl ||
                    "https://maps.google.com/maps?q=Central%20Rama%209&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
