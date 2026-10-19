import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, PhoneCall, ShieldCheck, Wrench, Lock } from "lucide-react";
import type { SiteSettings } from "../types";

interface NavbarProps {
  settings?: SiteSettings | null;
}

export function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "หน้าแรก", path: "/" },
    { name: "บริการ & เกี่ยวกับเรา", path: "/about" },
    { name: "ติดต่อเรา", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            id="nav-logo-link"
            to="/"
            className="flex items-center gap-3 group text-decoration-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {settings?.shopName ? settings.shopName.split("-")[0]?.trim() : "TechFix Pro"}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                  EXPERT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                Fast Mobile & Tablet Repairs
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  id={`nav-link-${link.path.replace("/", "") || "home"}`}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 shadow-inner"
                      : "text-slate-300 hover:text-white hover:bg-slate-850/60"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {settings?.phone && (
              <a
                id="nav-call-btn"
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700/80 hover:border-slate-600 hover:bg-slate-800 transition-all shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>{settings.phone}</span>
              </a>
            )}

            <Link
              id="nav-admin-link"
              to="/admin"
              title="เข้าสู่ระบบผู้ดูแลหลังบ้าน"
              className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              <Lock className="w-4 h-4" />
            </Link>

            <Link
              id="nav-cta-contact-btn"
              to="/contact"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-600/25 active:scale-95 transition-all"
            >
              ประเมินราคาฟรี
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin"
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
              title="Admin"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <button
              id="nav-mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 focus:outline-none"
              aria-label="เมนูนำทาง"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  active
                    ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-850 flex flex-col gap-2">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-slate-200 bg-slate-900 border border-slate-800"
              >
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                โทรด่วน: {settings.phone}
              </a>
            )}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600"
            >
              ประเมินราคาซ่อมฟรี
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
