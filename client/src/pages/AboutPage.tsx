import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench,
  CheckCircle,
  Tag,
  ArrowRight,
  Filter,
  Users,
  Award,
  Sparkles,
} from "lucide-react";
import { api } from "../api/client";
import { SEO } from "../components/SEO";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import type { Category, PageContentAbout, PageData, ServiceItem } from "../types";

export function AboutPage() {
  const [pageData, setPageData] = useState<PageData<PageContentAbout> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pageRes, catRes, servicesRes] = await Promise.all([
        api.getPage<PageContentAbout>("about"),
        api.getCategories(),
        api.getServices(),
      ]);

      if (pageRes.success) setPageData(pageRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (servicesRes.success) setServices(servicesRes.data);
    } catch (err: any) {
      console.error("Failed to load about page:", err);
      setError(err?.message || "ไม่สามารถเชื่อมต่อข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="กำลังโหลดข้อมูลบริการและเกี่ยวกับเรา..." />;
  }

  if (error || !pageData) {
    return <ErrorMessage message={error || "ไม่พบข้อมูลหน้านี้"} onRetry={fetchData} />;
  }

  const { content } = pageData;

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter(
          (s) =>
            s.categorySlug === selectedCategory ||
            String(s.categoryId) === selectedCategory
        );

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <SEO
        title={pageData.seoTitle}
        description={pageData.seoDescription}
        ogImage={pageData.ogImageUrl}
      />

      {/* Header Banner */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-slate-850">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              มาตรฐานช่างระดับมืออาชีพ
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              เกี่ยวกับเรา & บริการซ่อมทั้งหมด
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              เรารวมทุกบริการซ่อมมือถือ ทั้งงานเปลี่ยนอะไหล่ด่วน งานซ่อมเมนบอร์ดลายวงจร และงานกู้ข้อมูล
              ให้บริการอย่างซื่อตรง พร้อมรับประกันชัดเจน
            </p>
          </div>
        </div>
      </section>

      {/* About Company Section (เนื้อหายาว + รูป + สถิติ) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: About Image & Stats Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <img
                  src={
                    content?.aboutImageUrl ||
                    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                  }
                  alt={content?.aboutTitle || "ช่างเทคนิค TechFix Pro"}
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black text-xl">
                      {content?.experienceYears || 12}+
                    </div>
                    <div>
                      <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                        Experience
                      </p>
                      <p className="text-sm font-semibold text-white">ปีแห่งความเชี่ยวชาญด้านงานซ่อมมือถือ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Long Content & Stats */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                {content?.aboutTitle || "มุ่งมั่นส่งมอบบริการซ่อมที่โปร่งใส ซื่อตรง และมีมาตรฐานสูงสุด"}
              </h2>

              <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
                {content?.aboutContent}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-850">
                {(content?.stats || []).map((st, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-2xl font-black text-cyan-400">{st.value}</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Category Filters */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-white tracking-tight">
              รายการบริการซ่อมและอัตราค่าบริการ
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              เลือกดูตามหมวดหมู่บริการ ประเมินอาการเสียและราคาชัดเจนก่อนเริ่มงาน
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              บริการทั้งหมด ({services.length})
            </button>

            {categories.map((cat) => {
              const active = selectedCategory === cat.slug || selectedCategory === String(cat.id);
              const count = services.filter((s) => s.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Services Grid (Card: รูป, ชื่อ, รายละเอียดสั้น, ราคา) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-850">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-semibold text-cyan-300 border border-slate-800">
                      {service.categoryName}
                    </div>
                    {service.isFeatured && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-blue-600 text-[10px] font-extrabold text-white shadow">
                        ยอดนิยม
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                      {service.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-medium block">
                      ค่าบริการประมาณการ
                    </span>
                    <span className="text-xl font-extrabold text-cyan-400">
                      {service.price ? `฿${Number(service.price).toLocaleString()}` : "ประเมินฟรี"}
                    </span>
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-cyan-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-blue-500/30 hover:border-transparent"
                  >
                    <span>จองคิวซ่อม</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16 text-slate-500 text-sm">
              ยังไม่มีรายการบริการในหมวดหมู่นี้
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
