import { useEffect, useState } from "react";
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  User,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import { api } from "../../api/client";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { ContactMessage } from "../../types";

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getMessages();
      if (res.success) {
        setMessages(res.data);
      }
    } catch (err: any) {
      setErrorMsg("ไม่สามารถโหลดข้อความติดต่อได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Open message detail modal and mark as read automatically (spec requirement)
  const handleViewMessage = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (!msg.isRead) {
      try {
        const res = await api.admin.getMessage(msg.id);
        if (res.success) {
          // Update in local state
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
          );
        }
      } catch (e) {
        console.error("Mark as read failed:", e);
      }
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm("คุณต้องการลบข้อความนี้ใช่หรือไม่?")) return;

    try {
      const res = await api.admin.deleteMessage(id);
      if (res.success) {
        setSuccessMsg("ลบข้อความเรียบร้อยแล้ว");
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMsg?.id === id) setSelectedMsg(null);
      } else {
        setErrorMsg(res.error?.message || "ลบไม่สำเร็จ");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "เกิดข้อผิดพลาดในการลบ");
    }
  };

  if (loading) {
    return <LoadingSpinner message="กำลังโหลดข้อความติดต่อ..." />;
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ข้อความติดต่อจากลูกค้า (Messages)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            รายการฟอร์มติดต่อที่ส่งมาจากหน้าเว็บ เรียงจากใหม่สุดไปเก่าสุด
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs">
            ยังไม่อ่าน: {unreadCount} ข้อความ
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            ทั้งหมด: {messages.length} ข้อความ
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-3 text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-center justify-between gap-3 text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)}>
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* Messages List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-850">
          {messages.length === 0 ? (
            <div className="p-16 text-center text-slate-500">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-base font-semibold">ยังไม่มีข้อความติดต่อเข้ามา</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleViewMessage(msg)}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/70 transition-all ${
                  !msg.isRead ? "bg-blue-950/25 border-l-4 border-l-cyan-400" : ""
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    {/* Unread is Bold */}
                    <span
                      className={`text-sm ${
                        !msg.isRead ? "font-extrabold text-white" : "font-medium text-slate-300"
                      }`}
                    >
                      {msg.name}
                    </span>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        ยังไม่อ่าน
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-mono">• {msg.phone}</span>
                  </div>

                  <p
                    className={`text-xs ${
                      !msg.isRead ? "text-slate-200 font-semibold" : "text-slate-400"
                    } line-clamp-1`}
                  >
                    {msg.subject ? (
                      <span className="text-cyan-400 font-medium mr-1">[{msg.subject}]</span>
                    ) : null}
                    {msg.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <span className="text-[11px] text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 hover:text-rose-300 transition-colors"
                    title="ลบข้อความ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                  รายละเอียดข้อความติดต่อ
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedMsg.subject || "ไม่มีหัวข้อระบุ"}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-500 block">ผู้ส่ง:</span>
                <span className="text-white font-bold text-sm">{selectedMsg.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">เบอร์โทรศัพท์:</span>
                <a href={`tel:${selectedMsg.phone}`} className="text-cyan-400 font-bold hover:underline">
                  {selectedMsg.phone}
                </a>
              </div>
              {selectedMsg.email && (
                <div>
                  <span className="text-slate-500 block">อีเมล:</span>
                  <a href={`mailto:${selectedMsg.email}`} className="text-slate-300 hover:underline">
                    {selectedMsg.email}
                  </a>
                </div>
              )}
              <div>
                <span className="text-slate-500 block">เวลาที่ส่ง:</span>
                <span className="text-slate-400">
                  {new Date(selectedMsg.createdAt).toLocaleString("th-TH")}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                เนื้อหาข้อความ:
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                {selectedMsg.message}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleDeleteMessage(selectedMsg.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบข้อความนี้</span>
              </button>
              <button
                onClick={() => setSelectedMsg(null)}
                className="px-6 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
