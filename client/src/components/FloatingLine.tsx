import React from "react";
import { MessageCircle } from "lucide-react";

interface FloatingLineProps {
  lineUrl?: string;
}

export function FloatingLine({ lineUrl = "https://line.me" }: FloatingLineProps) {
  return (
    <aside aria-label="LINE Contact" className="fixed bottom-6 right-6 z-50">
      <a
        id="floating-line-btn"
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="ติดต่อเราผ่าน LINE"
        className="group flex items-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-[0_0_25px_rgba(6,199,85,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          แชทกับช่าง LINE
        </span>
      </a>
    </aside>
  );
}
