import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Star,
  FolderPlus,
  X,
} from "lucide-react";
import { api } from "../../api/client";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { Category, ServiceItem } from "../../types";

export function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCatFilter, setSelectedCatFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Service Modal state
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    categoryId: 1,
    description: "",
    price: "",
    imageUrl: "",
    isFeatured: false,
    isActive: true,
    sortOrder: 0,
  });

  // Category Modal state
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", slug: "", sortOrder: 0 });

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const [svcRes, catRes] = await Promise.all([
        api.admin.getServices(searchQuery, selectedCatFilter, page, 10),
        api.admin.getCategories(),
      ]);

      if (svcRes.success) {
        setServices(svcRes.data);
        if (svcRes.meta) setMeta(svcRes.meta);
      }
      if (catRes.success) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !serviceForm.categoryId) {
          setServiceForm((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      }
    } catch (err: any) {
      setErrorMsg("ไม่สามารถโหลดข้อมูลบริการได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [selectedCatFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(1);
  };

  // Open modal for Create Service
  const handleOpenCreateService = () => {
    setEditingServiceId(null);
    setServiceForm({
      name: "",
      categoryId: categories[0]?.id || 1,
      description: "",
      price: "",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      isFeatured: false,
      isActive: true,
      sortOrder: 0,
    });
    setServiceModalOpen(true);
  };

  // Open modal for Edit Service
  const handleOpenEditService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      categoryId: service.categoryId,
      description: service.description,
      price: service.price || "",
      imageUrl: service.imageUrl,
      isFeatured: service.isFeatured,
      isActive: service.isActive,
      sortOrder: service.sortOrder,
    });
    setServiceModalOpen(true);
  };

  // Save Service (Create or Update)
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      if (editingServiceId) {
        const res = await api.admin.updateService(editingServiceId, serviceForm);
        if (res.success) {
          setSuccessMsg("อัปเดตข้อมูลบริการสำเร็จ");
          setServiceModalOpen(false);
          fetchData(meta.page);
        } else {
          setErrorMsg(res.error?.message || "บันทึกไม่สำเร็จ");
        }
      } else {
        const res = await api.admin.createService(serviceForm);
        if (res.success) {
          setSuccessMsg("เพิ่มบริการใหม่สำเร็จ");
          setServiceModalOpen(false);
          fetchData(1);
        } else {
          setErrorMsg(res.error?.message || "บันทึกไม่สำเร็จ");
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  // Delete Service with confirmation
  const handleDeleteService = async (id: number, name: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบบริการ "${name}"? การดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
      return;
    }

    try {
      const res = await api.admin.deleteService(id);
      if (res.success) {
        setSuccessMsg(`ลบบริการ "${name}" เรียบร้อยแล้ว`);
        fetchData(meta.page);
      } else {
        setErrorMsg(res.error?.message || "ลบไม่สำเร็จ");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "เกิดข้อผิดพลาดในการลบ");
    }
  };

  // Add Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.admin.createCategory(catForm);
      if (res.success) {
        setSuccessMsg(`เพิ่มหมวดหมู่ "${catForm.name}" สำเร็จ`);
        setCatForm({ name: "", slug: "", sortOrder: 0 });
        setCatModalOpen(false);
        fetchData(meta.page);
      } else {
        setErrorMsg(res.error?.message || "เพิ่มหมวดหมู่ไม่สำเร็จ");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "เกิดข้อผิดพลาด");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`คุณต้องการลบหมวดหมู่ "${name}" หรือไม่?`)) return;
    try {
      const res = await api.admin.deleteCategory(id);
      if (res.success) {
        setSuccessMsg(`ลบหมวดหมู่ "${name}" เรียบร้อยแล้ว`);
        fetchData(meta.page);
      } else {
        // Expected 409 if category in use
        setErrorMsg(res.error?.message || "ไม่สามารถลบได้");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "เกิดข้อผิดพลาดในการลบหมวดหมู่");
    }
  };

  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            จัดการบริการ & สินค้า (Services)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            เพิ่ม ลบ แก้ไข รายการบริการและหมวดหมู่ ข้อมูลจะแสดงผลที่หน้าบ้านอัตโนมัติ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCatModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            <span>จัดการหมวดหมู่ ({categories.length})</span>
          </button>

          <button
            id="admin-add-service-btn"
            onClick={handleOpenCreateService}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มบริการใหม่</span>
          </button>
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

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อบริการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </form>

        {/* Filter by Category */}
        <div className="w-full sm:w-auto flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกหมวดหมู่ ({meta.total} รายการ)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4">รูปภาพ</th>
                <th className="p-4">ชื่อบริการ</th>
                <th className="p-4">หมวดหมู่</th>
                <th className="p-4">ราคา</th>
                <th className="p-4">หน้าแรก</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    กำลังโหลดรายการบริการ...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    ไม่พบบริการที่ค้นหา
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-4">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-800 border border-slate-700"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-white text-sm">{service.name}</p>
                      <p className="text-slate-400 text-[11px] line-clamp-1 max-w-xs mt-0.5">
                        {service.description}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                        {service.categoryName || "-"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-cyan-400">
                      {service.price ? `฿${Number(service.price).toLocaleString()}` : "ประเมินฟรี"}
                    </td>
                    <td className="p-4">
                      {service.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>แสดง</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">ไม่แสดง</span>
                      )}
                    </td>
                    <td className="p-4">
                      {service.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <Eye className="w-3.5 h-3.5" />
                          <span>เปิด</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>ปิด</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditService(service)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300"
                          title="แก้ไขบริการ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id, service.name)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 hover:text-rose-300"
                          title="ลบบริการ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (10 รายการต่อหน้าตาม spec) */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            แสดง {services.length} จากทั้งหมด {meta.total} รายการ (หน้า {meta.page} จาก {totalPages})
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => fetchData(meta.page - 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ก่อนหน้า
            </button>
            <button
              disabled={meta.page >= totalPages}
              onClick={() => fetchData(meta.page + 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* Service Modal (Add / Edit) */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingServiceId ? "แก้ไขข้อมูลบริการ" : "เพิ่มบริการใหม่"}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  ชื่อบริการ *
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="เช่น เปลี่ยนหน้าจอแท้ OLED"
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    หมวดหมู่บริการ *
                  </label>
                  <select
                    value={serviceForm.categoryId}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, categoryId: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    ราคา (บาท) - ปล่อยว่างถ้าประเมินฟรี
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="2500"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  รูปภาพบริการ (Image URL) *
                </label>
                <input
                  type="url"
                  required
                  value={serviceForm.imageUrl}
                  onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  รายละเอียดบริการ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.isFeatured}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
                  />
                  <span>แสดงที่หน้าแรก (Featured)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceForm.isActive}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
                  />
                  <span>เปิดใช้งาน (Active)</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                >
                  บันทึกบริการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">จัดการหมวดหมู่บริการ</h3>
              <button onClick={() => setCatModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Categories list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                หมวดหมู่ปัจจุบัน
              </h4>
              <div className="divide-y divide-slate-800 max-h-48 overflow-y-auto">
                {categories.map((c) => (
                  <div key={c.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white text-xs">{c.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono ml-2">({c.slug})</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold p-1"
                      title="ลบหมวดหมู่"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleCreateCategory} className="border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                เพิ่มหมวดหมู่ใหม่
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="ชื่อหมวดหมู่ (เช่น ซ่อมบอร์ด)"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  required
                  placeholder="slug (เช่น board-repair)"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  + เพิ่มหมวดหมู่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
