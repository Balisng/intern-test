import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Wrench,
  Mail,
  LogOut,
  ExternalLink,
  Shield,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { api } from "../../api/client";
import type { AdminUser } from "../../types";

export function AdminLayout() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.admin.getMe();
        if (res.success && res.data) {
          setCurrentUser(res.data);
        } else {
          navigate("/admin/login", { replace: true });
        }
      } catch (err) {
        navigate("/admin/login", { replace: true });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.admin.logout();
    } catch (e) {
      // Ignore error and redirect
    }
    navigate("/admin/login", { replace: true });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
        <p className="text-slate-400 text-sm font-medium">กำลังตรวจสอบสิทธิ์ผู้ดูแลระบบ...</p>
      </div>
    );
  }

  const navItems = [
    { name: "แดชบอร์ด", path: "/admin", icon: LayoutDashboard },
    { name: "จัดการบริการ & หมวดหมู่", path: "/admin/services", icon: Wrench },
    { name: "ข้อความติดต่อ", path: "/admin/messages", icon: Mail },
    { name: "จัดการเนื้อหา & SEO", path: "/admin/pages", icon: FileText },
    { name: "ตั้งค่าเว็บไซต์", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900/90 border-r border-slate-800 shrink-0 min-h-screen p-4 justify-between">
        <div className="space-y-6">
          {/* Brand header */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white block">TechFix Pro</span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          {/* User badge */}
          {currentUser && (
            <div className="px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <p className="text-slate-400 text-[11px]">ผู้ใช้งานปัจจุบัน</p>
              <p className="text-white font-bold truncate mt-0.5">{currentUser.name}</p>
              <p className="text-slate-500 truncate text-[10px]">{currentUser.email}</p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions in sidebar */}
        <div className="pt-4 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>ดูหน้าเว็บจริง</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm text-white">TechFix Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 bg-slate-800 rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              <item.icon className="w-4 h-4 text-cyan-400" />
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <Link to="/" target="_blank" className="text-xs text-cyan-400 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ดูหน้าเว็บ</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-rose-400 flex items-center gap-1 font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
