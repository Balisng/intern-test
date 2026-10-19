export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  error?: {
    code: string;
    message: string;
    details: Record<string, any>;
  };
}

export interface SiteSettings {
  id: number;
  shopName: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  lineUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  mapUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageContentHome {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  ctaText: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface PageContentAbout {
  aboutTitle: string;
  aboutContent: string;
  aboutImageUrl: string;
  experienceYears: number;
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface PageContentContact {
  contactNote: string;
  emergencyPhone: string;
  directions: string;
}

export interface PageData<T = any> {
  id: number;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  content: T;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: number;
  categoryId: number;
  categoryName?: string;
  categorySlug?: string;
  name: string;
  description: string;
  price: string | null;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}
