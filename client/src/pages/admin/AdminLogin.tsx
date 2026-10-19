import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Shield, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { api } from "../../api/client";

export function AdminLogin() {
  const [email, setEmail] = useState("admin@techfixpro.com");
  const [password, setPassword] = useState("Admin1234!");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.admin.login({ email, password });
      if (res.success) {
        navigate("/admin", { replace: true });
      } else {
        // Spec requirement: "ผิดแสดงข้อความ 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' (ห้ามบอกว่าผิดช่องไหน)"
        setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err: any) {
      setErrorMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20 mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Shield className="w-7 h-7" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            เข้าสู่ระบบผู้ดูแลหลังบ้าน
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            ระบบจัดการเนื้อหา เว็บไซต์ STARTER (TechFix Pro)
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {errorMsg && (
            <div
              id="admin-login-error"
              className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in"
            >
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email-input"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                อีเมลผู้ดูแลระบบ
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@techfixpro.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
              >
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังตรวจสอบข้อมูล...</span>
                </>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Test credentials hint */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400">
              🔑 <span className="font-semibold text-slate-300">บัญชีทดสอบที่ Seed ไว้:</span>
            </p>
            <p className="text-xs text-cyan-400 font-mono mt-1 select-all">
              admin@techfixpro.com / Admin1234!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
