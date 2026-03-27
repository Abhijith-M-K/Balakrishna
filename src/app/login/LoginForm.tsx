"use client";

import React, { useState } from "react";
import { Lock, Mail, ChevronRight } from "lucide-react";
import { loginAction } from "./actions";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const { showLoading, hideLoading } = useLoading();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    showLoading("Authenticating...");
    
    try {
      // We use the server action directly
      const result = await loginAction(formData);
      
      // If loginAction redirects, this code might not even finish
      // But we handle it just in case or if it returns an error
      if (result?.error) {
        toast.error(result.error);
        hideLoading();
      } else {
        toast.success("Login successful! Redirecting...");
        // hideLoading will be handled by the layout on unmount/navigation if needed, 
        // but let's be safe.
      }
    } catch (error: any) {
      // Next.js redirect throws an error, we should NOT catch it if it's a redirect
      if (error.message?.includes("NEXT_REDIRECT")) {
        // This is expected
        toast.success("Login successful!");
        return;
      }
      
      console.error("Login client error:", error);
      toast.error(error.message || "Invalid credentials. Please try again.");
      hideLoading();
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginLeft: "0.2rem", textTransform: "uppercase", letterSpacing: "0.025em" }}>
          Email Address
        </label>
        <div style={{ position: "relative" }}>
          <Mail size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input 
            name="email"
            type="email" 
            placeholder="admin@mailinator.com"
            required
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              color: "#1e293b",
              outline: "none",
              fontSize: "0.95rem",
              transition: "all 0.2s"
            }}
            className="login-input"
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginLeft: "0.2rem", textTransform: "uppercase", letterSpacing: "0.025em" }}>
          Access Password
        </label>
        <div style={{ position: "relative" }}>
          <Lock size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input 
            name="password"
            type="password" 
            placeholder="••••••••"
            required
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              color: "#1e293b",
              outline: "none",
              fontSize: "0.95rem",
              transition: "all 0.2s"
            }}
            className="login-input"
          />
        </div>
      </div>

      <button 
        type="submit" 
        style={{
          marginTop: "0.75rem",
          padding: "0.875rem",
          background: "var(--accent-primary)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontWeight: 700,
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: "0 4px 6px -1px rgba(91, 75, 223, 0.2)"
        }}
        className="btn-login"
      >
        Enter Dashboard <ChevronRight size={18} />
      </button>
    </form>
  );
}
