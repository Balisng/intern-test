import { useEffect, useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../../api/client";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { SiteSettings } from "../../types";

export function AdminSettings({ onSettingsUpdated }: { onSettingsUpdated?: () => void }) {
  const [formData, setFormData] = useState<Partial<SiteSettings>>({
    shopName: "",
    logoUrl: "",
    phone: "",
    email: "",
    address: "",
    openingHours: "",
    lineUrl: "",
    facebookUrl: "",
    instagramUrl: "",
    mapUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.getSettings();
        if (res.success && res.data) {
          setFormData(res.data);
        }
      } catch (err: any) {
        setErrorMsg("ไม่สามารถโหลดข้อมูลการตั้งค่าได้");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await api.admin.updateSettings(formData);
      if (res.success) {
        setSuccessMsg("บันทึกการตั้งค่าเว็บไซต์สำเร็จ! ข้อมูลหน้าบ้านได้รับการอัปเดตเรียบร้อย");
        if (onSettingsUpdated) onSettingsUpdated();
      } else {
        setErrorMsg(res.error?.message || "บันทึกข้อมูลไม่สำเร็จ");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="กำลังโหลดข้อมูลการตั้งค่าเว็บไซต์..." />;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ตั้งค่าเว็บไซต์ (Site Settings)
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          แก้ไขข้อมูลร้าน โลโก้ ข้อมูลการติดต่อ โซเชียลมีเดีย และแผนที่ ซึ่งจะแสดงผลที่ Navbar และ Footer
        </p>
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

      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Basic Shop Info */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            ข้อมูลพื้นฐานของร้าน
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                ชื่อร้านค้า / ธุรกิจ *
              </label>
              <input
                type="text"
                name="shopName"
                required
                value={formData.shopName || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                ลิงก์รูปโลโก้ (Image URL) *
              </label>
              <input
                type="url"
                name="logoUrl"
                required
                value={formData.logoUrl || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            ข้อมูลติดต่อและเวลาทำการ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                เบอร์โทรศัพท์ *
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                อีเมลติดต่อ *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ที่อยู่ร้านค้า *
            </label>
            <textarea
              name="address"
              rows={2}
              required
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              เวลาทำการ *
            </label>
            <input
              type="text"
              name="openingHours"
              required
              value={formData.openingHours || ""}
              onChange={handleChange}
              placeholder="จันทร์ - เสาร์ 10:00 - 20:00 น."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Social Media & Maps */}
        <div className="space-y-4 pt-4">
          <h2 className="text-base font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            โซเชียลมีเดีย & แผนที่ Google Maps
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                ลิงก์ LINE (ปุ่มลอย & Footer) *
              </label>
              <input
                type="url"
                name="lineUrl"
                required
                value={formData.lineUrl || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                ลิงก์ Facebook *
              </label>
              <input
                type="url"
                name="facebookUrl"
                required
                value={formData.facebookUrl || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                ลิงก์ Instagram *
              </label>
              <input
                type="url"
                name="instagramUrl"
                required
                value={formData.instagramUrl || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              ลิงก์ Embed Google Maps (iframe src) *
            </label>
            <input
              type="text"
              name="mapUrl"
              required
              value={formData.mapUrl || ""}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>
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
                <span>กำลังบันทึกข้อมูล...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
