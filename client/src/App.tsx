import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { api } from "./api/client";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FloatingLine } from "./components/FloatingLine";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// Admin pages
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminRegister } from "./pages/admin/AdminRegister";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminPages } from "./pages/admin/AdminPages";
import { AdminServices } from "./pages/admin/AdminServices";
import { AdminMessages } from "./pages/admin/AdminMessages";

import type { SiteSettings } from "./types";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout({
  settings,
  children,
}: {
  settings: SiteSettings | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingLine lineUrl={settings?.lineUrl} />
    </div>
  );
}

export function App() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (e) {
      console.warn("Could not load initial settings:", e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with Navbar & Footer */}
        <Route
          path="/"
          element={
            <PublicLayout settings={settings}>
              <HomePage settings={settings} />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout settings={settings}>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout settings={settings}>
              <ContactPage settings={settings} />
            </PublicLayout>
          }
        />

        {/* Admin Login & Register */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="pages" element={<AdminPages />} />
          <Route
            path="settings"
            element={<AdminSettings onSettingsUpdated={fetchSettings} />}
          />
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <PublicLayout settings={settings}>
              <NotFoundPage />
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
