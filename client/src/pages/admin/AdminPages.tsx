import { useEffect, useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2, Sparkles, Layers } from "lucide-react";
import { api } from "../../api/client";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { PageData } from "../../types";

export function AdminPages() {
  const [selectedSlug, setSelectedSlug] = useState<"home" | "about" | "contact">("home");
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPage = async (slug: string) => {
    try {
      setLoading(true);
      setSuccessMsg(null);
      setErrorMsg(null);
      const res = await api.getPage(slug);
      if (res.success) {
        setPageData(res.data);
      }
    } catch (err: any) {
      setErrorMsg("ไม่สามารถโหลดข้อมูลหน้าเว็บนี้ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(selectedSlug);
  }, [selectedSlug]);

  const handleSEOChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!pageData) return;
    setPageData({ ...pageData, [name]: value });
  };

  const handleContentChange = (field: string, value: any) => {
    if (!pageData) return;
    setPageData({
      ...pageData,
      content: {
        ...pageData.content,
        [field]: value,
      },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await api.admin.updatePage(selectedSlug, {
        seoTitle: pageData.seoTitle,
        seoDescription: pageData.seoDescription,
        ogImageUrl: pageData.ogImageUrl,
        content: pageData.content,
      });

      if (res.success) {
        setSuccessMsg(`บันทึกเนื้อหาหน้า '${selectedSlug}' สำเร็จ! ข้อมูลหน้าบ้านอัปเดตเรียบร้อย`);
      } else {
        setErrorMsg(res.error?.message || "บันทึกไม่สำเร็จ");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          จัดการเนื้อหาแต่ละหน้า & SEO (Pages)
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          แก้ไขข้อความ Hero, จุดเด่นของร้าน, ข้อมูลเกี่ยวกับเรา และแท็ก SEO / OG Tags ของแต่ละหน้า
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {(
          [
            { slug: "home", label: "หน้าแรก (Home)" },
            { slug: "about", label: "เกี่ยวกับเรา (About)" },
            { slug: "contact", label: "ติดต่อเรา (Contact)" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.slug}
            onClick={() => setSelectedSlug(tab.slug)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedSlug === tab.slug
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading || !pageData ? (
        <LoadingSpinner message="กำลังโหลดข้อมูลเนื้อหาหน้าเว็บ..." />
      ) : (
        <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* SEO Section */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              การตั้งค่า SEO & Social Sharing (OG Tags)
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                SEO Title (&lt;title&gt;) *
              </label>
              <input
                type="text"
                name="seoTitle"
                required
                value={pageData.seoTitle}
                onChange={handleSEOChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Meta Description (คำอธิบายสำหรับ Google & Bot) *
              </label>
              <textarea
                name="seoDescription"
                rows={2}
                required
                value={pageData.seoDescription}
                onChange={handleSEOChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                OG Image URL (รูปเวลาแชร์ลิงก์ลง LINE / Facebook) *
              </label>
              <input
                type="url"
                name="ogImageUrl"
                required
                value={pageData.ogImageUrl}
                onChange={handleSEOChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Dynamic Page Content Section based on slug */}
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              เนื้อหาบนหน้าเว็บ ({selectedSlug.toUpperCase()})
            </h2>

            {selectedSlug === "home" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    หัวข้อใหญ่ Hero (H1) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageData.content?.heroTitle || ""}
                    onChange={(e) => handleContentChange("heroTitle", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    คำบรรยายรอง Hero *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={pageData.content?.heroSubtitle || ""}
                    onChange={(e) => handleContentChange("heroSubtitle", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      รูปภาพพื้นหลัง/ประกอบ Hero (Image URL) *
                    </label>
                    <input
                      type="url"
                      required
                      value={pageData.content?.heroImageUrl || ""}
                      onChange={(e) => handleContentChange("heroImageUrl", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      ข้อความบนปุ่ม Call-to-Action *
                    </label>
                    <input
                      type="text"
                      required
                      value={pageData.content?.ctaText || ""}
                      onChange={(e) => handleContentChange("ctaText", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedSlug === "about" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    หัวข้อเกี่ยวกับเรา *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageData.content?.aboutTitle || ""}
                    onChange={(e) => handleContentChange("aboutTitle", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    เนื้อหายาวเกี่ยวกับร้าน *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={pageData.content?.aboutContent || ""}
                    onChange={(e) => handleContentChange("aboutContent", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    รูปภาพประกอบเกี่ยวกับเรา (Image URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={pageData.content?.aboutImageUrl || ""}
                    onChange={(e) => handleContentChange("aboutImageUrl", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {selectedSlug === "contact" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    ข้อความหมายเหตุหน้าติดต่อ *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageData.content?.contactNote || ""}
                    onChange={(e) => handleContentChange("contactNote", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    คำแนะนำการเดินทาง (ขนส่งสาธารณะ/จุดสังเกต)
                  </label>
                  <textarea
                    rows={3}
                    value={pageData.content?.directions || ""}
                    onChange={(e) => handleContentChange("directions", e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึกหน้าเว็บ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>บันทึกเนื้อหาหน้า {selectedSlug.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
