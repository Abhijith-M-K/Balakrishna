"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="app-layout">
      {!isLoginPage && (
        <>
          <div className="mobile-header" style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "4rem",
            background: "var(--glass-bg)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border-color)",
            zIndex: 30,
            display: "none", // Overridden by media query
            alignItems: "center",
            padding: "0 1rem"
          }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "0.5rem" }}
              aria-label="Open Menu"
            >
              <Menu size={24} color="var(--text-primary)" />
            </button>
            <h1 style={{ fontSize: "1.2rem", marginLeft: "1rem", margin: 0 }}>Balakrishna Admin</h1>
          </div>
          
          <div 
            className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          />
          
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
      )}
      <main className={isLoginPage ? "login-content" : "main-content"}>
        {children}
      </main>
    </div>
  );
}
