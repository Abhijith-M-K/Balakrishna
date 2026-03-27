import { CalendarDays, Plus, Clock, User, CarFront, Filter, X, CheckCircle2, AlertCircle, CalendarRange } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/formatters";
import AttendanceToggle from "./AttendanceToggle";

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
    const { date: filterDate } = await searchParams;

    const where: any = {};
    if (filterDate) {
        const startOfDay = new Date(filterDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filterDate);
        endOfDay.setHours(23, 59, 59, 999);

        where.date = {
            gte: startOfDay,
            lte: endOfDay
        };
    }

    const schedules = await prisma.classSchedule.findMany({
        where,
        include: {
            student: true,
            trainer: true,
            vehicle: true
        },
        orderBy: [
            { date: "desc" },
            { startTime: "desc" }
        ]
    });

    // Grouping schedules by date
    const groupedSchedules = schedules.reduce((groups: any, schedule: any) => {
        const dateKey = schedule.date.toISOString().split('T')[0];
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(schedule);
        return groups;
    }, {});

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const now = new Date();
    const getStatusInfo = (schedule: any) => {
        if (schedule.attended) {
            return { label: "Completed", color: "var(--success)", icon: <CheckCircle2 size={14} /> };
        }
        const start = new Date(schedule.startTime);
        const end = new Date(schedule.endTime);
        
        if (now >= start && now <= end) {
            return { label: "In Progress", color: "var(--accent-primary)", icon: <Clock size={14} /> };
        }
        if (start > now) {
            return { label: "Upcoming", color: "var(--warning)", icon: <CalendarRange size={14} /> };
        }
        return { label: "Overdue", color: "var(--danger)", icon: <AlertCircle size={14} /> };
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
            <div style={{ 
                position: "sticky", 
                top: "0", 
                zIndex: 30, 
                background: "var(--bg-primary)", 
                paddingTop: "1rem", 
                paddingBottom: "1rem", 
                margin: "-1rem -1rem 2rem -1rem", 
                paddingLeft: "1rem", 
                paddingRight: "1rem", 
                borderBottom: "1px solid var(--border-color)",
                backdropFilter: "blur(10px)"
            }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={{ marginBottom: "0.25rem" }}>Class Schedule</h1>
                        <p className="text-muted">Manage sessions and track student attendance.</p>
                    </div>
                    <Link href="/schedule/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Plus size={18} />
                        Schedule Class
                    </Link>
                </header>
            </div>

            {/* Filter Bar */}
            <form method="GET" action="/schedule" className="glass-card" style={{ padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>
                    <Filter size={18} />
                    <span>Filter:</span>
                </div>
                <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
                    <input
                        name="date"
                        type="date"
                        defaultValue={filterDate || ''}
                        style={{
                            width: "100%",
                            padding: "0.6rem 1rem",
                            background: "var(--bg-tertiary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "var(--radius-md)",
                            color: "var(--text-primary)",
                            outline: "none",
                            fontFamily: "inherit"
                        }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: "0.6rem 1.5rem" }}>
                    Apply Filter
                </button>
                {filterDate && (
                    <Link href="/schedule" className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1rem" }}>
                        <X size={16} />
                        Clear
                    </Link>
                )}
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {schedules.length === 0 ? (
                    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
                        <CalendarDays size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                        <h3>{filterDate ? "No classes on this date" : "No classes scheduled"}</h3>
                        <p>{filterDate ? "Try selecting another date or clear the filter." : "Click 'Schedule Class' to get started with your first booking."}</p>
                    </div>
                ) : (
                    Object.keys(groupedSchedules).map((dateKey) => (
                        <div key={dateKey}>
                            <h3 style={{ 
                                fontSize: "1.1rem", 
                                color: "var(--text-muted)", 
                                marginBottom: "1rem", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "0.75rem",
                                fontWeight: 600
                            }}>
                                <CalendarDays size={18} /> 
                                {formatDate(new Date(dateKey))}
                            </h3>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {groupedSchedules[dateKey].map((schedule: any) => {
                                    const status = getStatusInfo(schedule);
                                    return (
                                        <div key={schedule.id} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1.5rem",
                                            padding: "1.25rem",
                                            border: "1px solid var(--border-color)",
                                            borderRadius: "1rem",
                                            background: "var(--bg-secondary)",
                                            transition: "all 0.2s ease",
                                            position: "relative",
                                            overflow: "hidden",
                                            flexWrap: "wrap"
                                        }} className="schedule-item-hover">
                                            
                                            {/* Status indicator line */}
                                            <div style={{ 
                                                position: "absolute", 
                                                left: "0", 
                                                top: "0", 
                                                bottom: "0", 
                                                width: "4px", 
                                                background: status.color
                                            }} />

                                            {/* Time block */}
                                            <div style={{ 
                                                minWidth: "100px", 
                                                textAlign: "right", 
                                                fontWeight: 700, 
                                                color: "var(--text-primary)",
                                                fontSize: "0.95rem"
                                            }}>
                                                {formatTime(schedule.startTime)}
                                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
                                                    to {formatTime(schedule.endTime)}
                                                </div>
                                            </div>

                                            {/* Vertical Separator */}
                                            <div style={{ width: "1px", height: "40px", background: "var(--border-color)", flexShrink: 0 }}></div>

                                            {/* Session Details */}
                                            <div style={{ flex: "1 1 250px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                                                    <h4 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                                                        {schedule.student.name}
                                                    </h4>
                                                    <span className="badge" style={{ 
                                                        background: `rgba(${status.color === 'var(--success)' ? '16, 185, 129' : status.color === 'var(--accent-primary)' ? '59, 130, 246' : '245, 158, 11' }, 0.1)`, 
                                                        color: status.color,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.25rem",
                                                        fontSize: "0.75rem",
                                                        padding: "0.25rem 0.6rem"
                                                    }}>
                                                        {status.icon}
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                                        <User size={14} /> {schedule.trainer.name}
                                                    </span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                                        <CarFront size={14} /> {schedule.vehicle.registrationNumber}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
                                                {!schedule.attended && (
                                                    <Link 
                                                        href={`/schedule/${schedule.id}/edit`} 
                                                        className="btn btn-secondary" 
                                                        style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem", display: "flex", gap: "0.4rem" }}
                                                    >
                                                        Reschedule
                                                    </Link>
                                                )}
                                                
                                                <div style={{ 
                                                    display: "flex", 
                                                    flexDirection: "column", 
                                                    alignItems: "center", 
                                                    gap: "0.4rem",
                                                    padding: "0.5rem 1rem",
                                                    background: "rgba(0,0,0,0.02)",
                                                    borderRadius: "0.75rem",
                                                    minWidth: "120px"
                                                }}>
                                                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                                                        {schedule.attended ? "Completed" : "Mark Done"}
                                                    </span>
                                                    <AttendanceToggle id={schedule.id} initialStatus={schedule.attended} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <style>{`
                .schedule-item-hover:hover {
                    border-color: var(--accent-primary) !important;
                    background: var(--bg-primary) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
            `}</style>
        </div>
    );
}
