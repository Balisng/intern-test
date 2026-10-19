import React from "react";

export function LoadingSpinner({ message = "กำลังโหลดข้อมูล..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-8 space-y-4">
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 rounded-full border-4 border-blue-900/30 border-t-cyan-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
        </div>
      </div>
      <p className="text-slate-400 font-medium text-sm animate-pulse tracking-wide">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="w-full h-48 bg-slate-800 rounded-xl" />
      <div className="h-6 bg-slate-800 rounded-md w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-800/80 rounded w-full" />
        <div className="h-4 bg-slate-800/80 rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-800 rounded w-1/4" />
        <div className="h-9 bg-slate-800 rounded-lg w-1/3" />
      </div>
    </div>
  );
}
