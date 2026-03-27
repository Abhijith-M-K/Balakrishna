"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Toaster } from "sonner";
import { LoadingProvider, useLoading } from "@/context/LoadingContext";
import { VehicleLoader } from "@/components/ui/VehicleLoader";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hideLoading } = useLoading();
  const isLoginPage = pathname === "/login";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
    hideLoading(); // Auto-hide loader on any navigation
  }, [pathname, hideLoading]);

  return (
    <div className="app-layout">
      {!isLoginPage && (
        <>
          <div className="mobile-header">
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                padding: "0.5rem"
              }}
            >
              <Menu size={24} />
            </button>
            <span style={{ marginLeft: "1rem", fontWeight: 700, color: "var(--accent-primary)" }}>BALAKRISHNA</span>
          </div>

          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
            style={{ zIndex: 40 }}
          />
        </>
      )}
      <main className={isLoginPage ? "login-content" : "main-content"}>
        {children}
      </main>
    </div>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <Toaster position="top-right" richColors closeButton />
      <VehicleLoader />
      <LayoutContent>
        {children}
      </LayoutContent>
    </LoadingProvider>
  );
}
