import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  User,
  Shield,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { api } from "../../api/client";

export function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (password.length < 6) {
      setErrorMsg("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      const res = await api.admin.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res.success) {
        // Successfully registered and session cookie set -> redirect to dashboard
        navigate("/admin", { replace: true });
      } else {
        setErrorMsg(res.error?.message || "การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20 mb-4 hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Shield className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ลงทะเบียนผู้ดูแลระบบ
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            สร้างบัญชีแอดมินใหม่สำหรับจัดการเว็บไซต์ TechFix Pro
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div
              id="admin-register-error"
              className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                ชื่อ-นามสกุล <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น สมศักดิ์ จัดการดี"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                อีเมล <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin2@techfixpro.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                ยืนยันรหัสผ่านอีกครั้ง <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                id="admin-register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังสร้างบัญชีผู้ดูแล...</span>
                  </>
                ) : (
                  <>
                    <span>สมัครสมาชิกผู้ดูแลระบบ</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col items-center gap-2 text-xs">
            <p className="text-slate-400">
              มีบัญชีผู้ดูแลระบบอยู่แล้ว?{" "}
              <Link
                to="/admin/login"
                className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
              >
                เข้าสู่ระบบที่นี่
              </Link>
            </p>
            <Link to="/" className="text-slate-500 hover:text-slate-300 transition-colors mt-1">
              ← กลับสู่หน้าหลักเว็บไซต์
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
