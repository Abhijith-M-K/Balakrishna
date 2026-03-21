"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    CalendarDays,
    UserCheck,
    CarFront,
    FileBadge,
    BarChart3,
    LogOut,
    X
} from "lucide-react";
import { logoutAction } from "@/app/login/actions";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Students", href: "/students", icon: Users },
    { name: "Fees", href: "/fees", icon: CreditCard },
    { name: "Schedule", href: "/schedule", icon: CalendarDays },
    { name: "Trainers", href: "/trainers", icon: UserCheck },
    { name: "Vehicles", href: "/vehicles", icon: CarFront },
    { name: "Tests", href: "/tests", icon: FileBadge },
    { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <aside className={`glass-card sidebar ${isOpen ? "open" : ""}`}>
            {/* Mobile close button visible only when open horizontally, but we can just use CSS to position it or hide it on desktop */}
            <button 
                className="mobile-close-btn"
                onClick={onClose}
                style={{ 
                    display: isOpen ? "flex" : "none", 
                    position: "absolute", 
                    top: "1.2rem", 
                    right: "1.2rem", 
                    background: "transparent", 
                    border: "none", 
                    cursor: "pointer",
                    color: "var(--text-secondary)"
                }}
            >
                <X size={24} />
            </button>
            <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-hover))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 14px 0 rgba(91, 75, 223, 0.39)"
                }}>
                    <CarFront size={20} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: "1.1rem", margin: 0 }}>Balakrishna</h2>
                    <p className="text-muted" style={{ fontSize: "0.75rem", margin: 0 }}>Admin Portal</p>
                </div>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                {navItems.map((item) => {
                    const isActive = item.href === "/" 
                        ? pathname === "/" 
                        : pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                padding: "0.875rem 1rem",
                                borderRadius: "0.75rem",
                                background: isActive ? "linear-gradient(135deg, rgba(91, 75, 223, 0.15), rgba(91, 75, 223, 0.05))" : "transparent",
                                color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                                fontWeight: isActive ? 600 : 500,
                                border: isActive ? "1px solid rgba(91, 75, 223, 0.2)" : "1px solid transparent",
                                transition: "all 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                                    e.currentTarget.style.color = "var(--text-primary)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "var(--text-secondary)";
                                }
                            }}
                        >
                            <Icon size={20} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div style={{
                marginTop: "auto",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
            }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--bg-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>BA</span>
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                    <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Balakrishna Admin</p>
                    <p className="text-muted" style={{ margin: 0, fontSize: "0.7rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>balakrishna@mailinator.com</p>
                </div>
                <form action={logoutAction}>
                    <button 
                        type="submit"
                        style={{
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "none",
                            color: "var(--danger)",
                            cursor: "pointer",
                            padding: "0.6rem",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"}
                        title="Logout Securely"
                    >
                        <LogOut size={18} />
                    </button>
                </form>
            </div>
        </aside>
    );
}
