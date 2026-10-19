import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Wrench,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { api } from "../../api/client";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { ContactMessage } from "../../types";

export function AdminDashboard() {
  const [data, setData] = useState<{
    unreadMessagesCount: number;
    totalServicesCount: number;
    recentMessages: ContactMessage[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getDashboard();
      if (res.success) setData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner message="กำลังโหลดข้อมูลแดชบอร์ด..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          แดชบอร์ดภาพรวม (Overview)
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          สรุปสถิติข้อความติดต่อและบริการทั้งหมดในระบบ
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Unread Messages Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              ข้อความติดต่อที่ยังไม่อ่าน
            </span>
            <span className="text-4xl font-black text-cyan-400 block">
              {data?.unreadMessagesCount ?? 0}
            </span>
            <Link
              to="/admin/messages"
              className="text-xs text-slate-400 hover:text-cyan-400 inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>ดูข้อความทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Mail className="w-7 h-7" />
          </div>
        </div>

        {/* Total Services Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              รายการบริการทั้งหมด
            </span>
            <span className="text-4xl font-black text-blue-400 block">
              {data?.totalServicesCount ?? 0}
            </span>
            <Link
              to="/admin/services"
              className="text-xs text-slate-400 hover:text-blue-400 inline-flex items-center gap-1 font-medium transition-colors"
            >
              <span>จัดการบริการ & หมวดหมู่</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Wrench className="w-7 h-7" />
          </div>
        </div>

        {/* Quick Site Action Card */}
        <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/40 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
              สถานะเว็บไซต์
            </span>
            <h3 className="text-lg font-bold text-white">ระบบออนไลน์พร้อมใช้งาน</h3>
            <p className="text-slate-400 text-xs mt-1">
              เชื่อมต่อ PostgreSQL สำเร็จ ข้อมูลหน้าบ้านอัปเดตแบบเรียลไทม์
            </p>
          </div>
          <div className="pt-4 flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              <span>เปิดดูหน้าบ้าน</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/admin/settings"
              className="text-xs font-semibold text-slate-300 hover:text-white"
            >
              ตั้งค่าร้านค้า
            </Link>
          </div>
        </div>
      </div>

      {/* Recent 5 Contact Messages */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">ข้อความติดต่อล่าสุด 5 รายการ</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              ลูกค้าส่งฟอร์มมาจากหน้า Contact ของเว็บไซต์
            </p>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
          >
            <span>ดูทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-850">
          {(data?.recentMessages || []).length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              ยังไม่มีข้อความติดต่อเข้ามา
            </div>
          ) : (
            (data?.recentMessages || []).map((msg) => (
              <div
                key={msg.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors ${
                  !msg.isRead ? "bg-blue-950/20" : ""
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm ${
                        !msg.isRead ? "font-bold text-white" : "font-medium text-slate-300"
                      }`}
                    >
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        ข้อความใหม่
                      </span>
                    )}
                    <span className="text-xs text-slate-500">• {msg.phone}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    <span className="text-slate-300 font-semibold">{msg.subject ? `${msg.subject}: ` : ""}</span>
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Link
                    to="/admin/messages"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    เปิดอ่าน
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
