import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home, Wrench } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100">
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center mb-6 shadow-xl shadow-blue-950/40">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-300 mt-2 mb-3">ไม่พบหน้าที่คุณกำลังค้นหา</h2>
      <p className="text-slate-400 text-sm max-w-md mb-8">
        หน้าที่คุณกำลังเข้าถึงอาจถูกลบ ย้าย หรือไม่มีอยู่ในระบบ กรุณาตรวจสอบ URL อีกครั้ง
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>กลับสู่หน้าหลัก</span>
      </Link>
    </div>
  );
}
