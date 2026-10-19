import type {
  AdminUser,
  ApiResponse,
  Category,
  ContactMessage,
  PageData,
  ServiceItem,
  SiteSettings,
} from "../types";

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include", // for httpOnly cookie
  });

  const json = await res.json();
  if (!res.ok && !json.error) {
    throw new Error(`HTTP error ${res.status}`);
  }
  return json;
}

// Public API
export const api = {
  getSettings: () => request<SiteSettings>("/api/settings"),
  getPage: <T = any>(slug: string) => request<PageData<T>>(`/api/pages/${slug}`),
  getCategories: () => request<Category[]>("/api/categories"),
  getServices: (category?: string, featured?: boolean) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (featured) params.append("featured", "true");
    const query = params.toString() ? `?${params.toString()}` : "";
    return request<ServiceItem[]>(`/api/services${query}`);
  },
  sendContactMessage: (data: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }) =>
    request<{ id: number; message: string }>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Admin Auth API
  admin: {
    login: (credentials: { email: string; password: string }) =>
      request<{ user: AdminUser; message: string }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    logout: () =>
      request<{ message: string }>("/api/admin/logout", {
        method: "POST",
      }),
    getMe: () => request<AdminUser>("/api/admin/me"),
    getDashboard: () =>
      request<{
        unreadMessagesCount: number;
        totalServicesCount: number;
        recentMessages: ContactMessage[];
      }>("/api/admin/dashboard"),
    updateSettings: (data: Partial<SiteSettings>) =>
      request<SiteSettings>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    updatePage: (slug: string, data: { seoTitle: string; seoDescription: string; ogImageUrl: string; content: any }) =>
      request<PageData>("/api/admin/pages/" + slug, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    // Categories CRUD
    getCategories: () => request<Category[]>("/api/admin/categories"),
    createCategory: (data: { name: string; slug: string; sortOrder: number }) =>
      request<Category>("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateCategory: (id: number, data: Partial<Category>) =>
      request<Category>(`/api/admin/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteCategory: (id: number) =>
      request<{ message: string; id: number }>(`/api/admin/categories/${id}`, {
        method: "DELETE",
      }),
    // Services CRUD
    getServices: (q = "", category = "", page = 1, limit = 10) => {
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (category) params.append("category", category);
      params.append("page", String(page));
      params.append("limit", String(limit));
      return request<ServiceItem[]>(`/api/admin/services?${params.toString()}`);
    },
    createService: (data: any) =>
      request<ServiceItem>("/api/admin/services", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateService: (id: number, data: any) =>
      request<ServiceItem>(`/api/admin/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteService: (id: number) =>
      request<{ message: string; id: number }>(`/api/admin/services/${id}`, {
        method: "DELETE",
      }),
    // Messages
    getMessages: () => request<ContactMessage[]>("/api/admin/messages"),
    getMessage: (id: number) => request<ContactMessage>(`/api/admin/messages/${id}`),
    deleteMessage: (id: number) =>
      request<{ message: string; id: number }>(`/api/admin/messages/${id}`, {
        method: "DELETE",
      }),
  },
};
