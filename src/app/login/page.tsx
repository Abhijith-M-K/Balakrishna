import { loginAction } from "./actions";
import { Lock, Mail, ChevronRight, School, AlertCircle } from "lucide-react";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ error?: string }> 
}) {
  const { error } = await searchParams;

  return (
    <div 
      className="login-page" 
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f5f9", // Light slate background
        padding: "1rem",
        position: "relative",
        fontFamily: "var(--font-inter)"
      }}
    >
      <div 
        className="login-card animate-scale-in" 
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
          borderRadius: "1.25rem",
          zIndex: 1
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: "60px",
            height: "60px",
            background: "rgba(91, 75, 223, 0.1)",
            color: "var(--accent-primary)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem"
          }}>
            <School size={30} />
          </div>
          <h1 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "0.25rem", fontWeight: 800 }}>
            Balakrishna Admin
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: 500 }}>
            Management Portal Login
          </p>
        </div>

        {error && (
            <div style={{
                background: "#fef2f2",
                border: "1px solid #fee2e2",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                color: "#991b1b",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1.5rem"
            }}>
                <AlertCircle size={17} />
                {error}
            </div>
        )}

        <LoginForm />

        <div style={{ marginTop: "2rem", borderTop: "1px solid #f1f5f9", paddingTop: "1.5rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                Secure Administrative Gateway &bull; v1.1.0
            </p>
        </div>
      </div>

      <style>{`
        .login-input:focus {
          border-color: var(--accent-primary) !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(91, 75, 223, 0.1);
        }
        .btn-login:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
            box-shadow: 0 6px 12px -2px rgba(91, 75, 223, 0.3);
        }
        .btn-login:active {
          transform: translateY(0);
        }
        @keyframes scaleIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-scale-in {
            animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
