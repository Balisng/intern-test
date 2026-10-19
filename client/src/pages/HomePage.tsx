import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Clock,
  Award,
  Cpu,
  ArrowRight,
  CheckCircle,
  PhoneCall,
  Sparkles,
  Zap,
} from "lucide-react";
import { api } from "../api/client";
import { SEO } from "../components/SEO";
import { LoadingSpinner, SkeletonCard } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import type { PageContentHome, PageData, ServiceItem, SiteSettings } from "../types";

const iconMap: Record<string, any> = {
  ShieldCheck,
  Clock,
  Award,
  Cpu,
};

export function HomePage({ settings }: { settings?: SiteSettings | null }) {
  const [pageData, setPageData] = useState<PageData<PageContentHome> | null>(null);
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pageRes, servicesRes] = await Promise.all([
        api.getPage<PageContentHome>("home"),
        api.getServices(undefined, true),
      ]);

      if (pageRes.success) setPageData(pageRes.data);
      if (servicesRes.success) setFeaturedServices(servicesRes.data.slice(0, 3));
    } catch (err: any) {
      console.error("Failed to load home page data:", err);
      setError(err?.message || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="กำลังโหลดข้อมูลหน้าแรก..." />;
  }

  if (error || !pageData) {
    return <ErrorMessage message={error || "ไม่พบข้อมูลหน้าแรก"} onRetry={fetchData} />;
  }

  const { content } = pageData;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <SEO
        title={pageData.seoTitle}
        description={pageData.seoDescription}
        ogImage={pageData.ogImageUrl}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>ร้านซ่อมสมาร์ตโฟน & แท็บเล็ตครบวงจร</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                {content?.heroTitle || "ศูนย์ซ่อมมือถือด่วน วินิจฉัยฟรี รอรับได้ใน 30 นาที"}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {content?.heroSubtitle ||
                  "บริการตรวจเช็กและซ่อมแซมสมาร์ตโฟน iPhone, Samsung, iPad อะไหล่แท้เกรดพรีเมียม รับประกันงานซ่อมสูงสุด 1 ปีเต็ม"}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  id="hero-cta-btn"
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:opacity-95 shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
                >
                  <span>{content?.ctaText || "ปรึกษาช่างและประเมินราคาฟรี"}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  id="hero-services-btn"
                  to="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-750 transition-all"
                >
                  ดูบริการทั้งหมด
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>ตรวจเช็กสภาพฟรี</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>รอรับได้ใน 30 นาที</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>ประกันนานสูงสุด 1 ปี</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image with Tech Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
                  <img
                    src={
                      content?.heroImageUrl ||
                      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=1000&q=80"
                    }
                    alt={content?.heroTitle || "ช่างซ่อมมือถือ TechFix Pro"}
                    className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                        Lab Standard
                      </p>
                      <p className="text-sm font-semibold text-white">ห้องซ่อมปลอดฝุ่น & เลเซอร์ทันสมัย</p>
                    </div>
                    <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services (3 รายการเด่น) */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                บริการยอดนิยม
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                บริการซ่อมด่วนที่ลูกค้าไว้วางใจ
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                3 รายการเด่นที่ช่างตรวจเช็กและเปลี่ยนอะไหล่เสร็จไว รอรับกลับบ้านได้ทันที
              </p>
            </div>
            <Link
              to="/about"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold text-sm group"
            >
              <span>ดูบริการทั้งหมด</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="group relative bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-800">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-blue-600/90 backdrop-blur-md text-[11px] font-bold text-white shadow">
                      {service.categoryName || "ซ่อมด่วน"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                      {service.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">ราคาเริ่มต้น</span>
                    <span className="text-xl font-extrabold text-cyan-400">
                      {service.price ? `฿${Number(service.price).toLocaleString()}` : "ประเมินฟรี"}
                    </span>
                  </div>
                  <Link
                    to="/contact"
                    className="px-4 py-2 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    จองคิวซ่อม
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Shop Highlights (จุดเด่นของร้าน 3-4 ข้อ) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              ทำไมลูกค้าถึงเลือกซ่อมมือถือกับเรา?
            </h2>
            <p className="text-slate-400 text-base mt-2">
              เราใส่ใจในทุกรายละเอียด ตั้งแต่อะไหล่ เครื่องมือ ไปจนถึงการรับประกันงานซ่อม
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(content?.features || []).map((feat, idx) => {
              const IconComp = iconMap[feat.icon] || ShieldCheck;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="py-14 bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white">ต้องการสอบถามอาการเสียก่อนนำเครื่องมา?</h3>
            <p className="text-slate-400 text-sm mt-1">
              ทักแชท LINE หรือโทรปรึกษาช่างได้โดยตรง ไม่มีค่าใช้จ่ายในการประเมินเบื้องต้น
            </p>
          </div>
          <div className="flex items-center gap-4">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold text-sm flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>โทร {settings.phone}</span>
              </a>
            )}
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30"
            >
              ติดต่อส่งเครื่องซ่อม
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
