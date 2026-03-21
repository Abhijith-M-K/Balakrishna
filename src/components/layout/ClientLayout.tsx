"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="app-layout">
      {!isLoginPage && <Sidebar />}
      <main className={isLoginPage ? "login-content" : "main-content"}>
        {children}
      </main>
      <style>{`
        .login-content {
          width: 100%;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
