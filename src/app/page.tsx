import {
  Users,
  UserCheck,
  Wallet,
  TrendingUp,
  CarFront,
  Clock,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  CalendarDays
} from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatDate } from "@/lib/formatters";
import { ClassSchedule, Student, Trainer, Vehicle, FeePayment, TestSchedule } from "@prisma/client";

type ClassWithDetails = ClassSchedule & {
  student: Student;
  trainer: Trainer;
  vehicle: Vehicle;
};

type TestWithDetails = TestSchedule & {
  student: Student;
};

export default async function DashboardPage() {
  const now = new Date();
  const startOfToday = new Date(new Date(now).setHours(0, 0, 0, 0));
  const endOfToday = new Date(new Date(now).setHours(23, 59, 59, 999));
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Fetch Students Stats
  const [totalStudents, activeStudents, allStudents] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: 'TRAINING' } }),
    prisma.student.findMany({ 
      select: { 
        totalFee: true, 
        feePayments: { select: { paidAmount: true } } 
      } 
    })
  ]);

  // 2. Calculate Pending Fees
  const totalCourseFees = allStudents.reduce((sum: number, s: { totalFee: number }) => sum + (s.totalFee || 0), 0);
  const totalPaidAmount = allStudents.reduce((sum: number, s: { feePayments: { paidAmount: number }[] }) => {
    const paid = s.feePayments.reduce((pSum: number, p: { paidAmount: number }) => pSum + p.paidAmount, 0);
    return sum + paid;
  }, 0);
  const pendingFees = totalCourseFees - totalPaidAmount;

  // 3. Monthly Revenue (Current Month)
  const currentMonthPayments = await prisma.feePayment.findMany({
    where: { paymentDate: { gte: startOfMonth } },
    select: { paidAmount: true }
  });
  const monthlyRevenue = currentMonthPayments.reduce((sum: number, p: { paidAmount: number }) => sum + p.paidAmount, 0);

  // 4. Today's Classes
  const todaysClasses = await prisma.classSchedule.findMany({
    where: {
      date: {
        gte: startOfToday,
        lte: endOfToday
      }
    },
    include: {
      student: true,
      trainer: true,
      vehicle: true
    },
    orderBy: { startTime: 'asc' }
  }) as ClassWithDetails[];

  // 5. Upcoming Tests
  const upcomingTests = await prisma.testSchedule.findMany({
    where: {
      testDate: { gte: startOfToday },
      status: 'PENDING'
    },
    include: { student: true, vehicle: true },
    orderBy: { testDate: 'asc' },
    take: 5
  }) as TestWithDetails[];

  // 6. Vehicle Stats
  const [totalVehicles, serviceDueVehicles] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({
      where: {
        OR: [
          { serviceReminder: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }, // Due in 7 days
          { serviceReminder: { lte: new Date() } } // Already past
        ]
      }
    })
  ]);

  // Determine current classes and vehicles in training
  const currentTime = new Date();
  const vehiclesInTraining = new Set(todaysClasses.map((c: ClassWithDetails) => c.vehicleId)).size;
  const vehiclesAvailable = totalVehicles - vehiclesInTraining;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
      <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Dashboard Overview</h1>
          <p className="text-muted" style={{ fontSize: "1.05rem" }}>
            Welcome back! Here's what's happening at your driving school today.
          </p>
        </div>
        <Link href="/students/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Users size={18} />
          New Admission
        </Link>
      </header>

      {/* Metrics Grid */}
      <div className="metric-grid">
        <MetricCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          trend="Lifetime enrolled"
          icon={<Users size={24} color="var(--accent-primary)" />}
        />
        <MetricCard
          title="Active Students"
          value={activeStudents.toLocaleString()}
          trend="Currently in training"
          icon={<UserCheck size={24} color="var(--success)" />}
        />
        <MetricCard
          title="Pending Fees"
          value={`₹${pendingFees.toLocaleString()}`}
          trend="Outstanding balance"
          icon={<Wallet size={24} color="var(--warning)" />}
        />
        <MetricCard
          title="Monthly Revenue"
          value={`₹${monthlyRevenue.toLocaleString()}`}
          trend="Received this month"
          icon={<TrendingUp size={24} color="var(--accent-primary)" />}
        />
      </div>

      <div className="dashboard-sections" style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: "1.5rem" }}>
        {/* Left Column: Today's Classes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <section className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock size={20} /> Today's Classes
              </h2>
              <Link href="/schedule" style={{ textDecoration: "none", color: "var(--accent-primary)", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", fontWeight: 600 }}>
                View Full Schedule <ChevronRight size={16} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {todaysClasses.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", background: "var(--bg-tertiary)", borderRadius: "var(--radius-lg)", color: "var(--text-muted)" }}>
                  <CalendarDays size={48} style={{ opacity: 0.2, marginBottom: "1rem" }} />
                  <p>No classes scheduled for today.</p>
                </div>
              ) : (
                todaysClasses.map((cls: ClassWithDetails) => {
                  const startTime = new Date(cls.startTime);
                  const endTime = new Date(cls.endTime);
                  const isCurrent = currentTime >= startTime && currentTime <= endTime;
                  const isPassed = currentTime > endTime;
                  
                  const status = cls.attended ? "Completed" : isCurrent ? "In Progress" : isPassed ? "Overdue" : "Upcoming";

                  return (
                    <ClassItem 
                      key={cls.id}
                      time={cls.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      student={cls.student.name} 
                      trainer={cls.trainer.name} 
                      vehicle={`${cls.vehicle.registrationNumber} (${cls.vehicle.vehicleType})`} 
                      status={status} 
                    />
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Tests & Availability */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <section className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem" }}>Upcoming Tests</h2>
              <Link href="/tests" style={{ color: "var(--accent-primary)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600 }}>History</Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {upcomingTests.length === 0 ? (
                <p style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>No upcoming tests scheduled.</p>
              ) : (
                upcomingTests.map((test: TestWithDetails) => (
                  <TestItem 
                    key={test.id}
                    date={formatDate(test.testDate)} 
                    student={test.student.name} 
                    type={test.student.licenseType} 
                  />
                ))
              )}
            </div>
          </section>

          <section className="glass-card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Fleet Status</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "rgba(16, 185, 129, 0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <CarFront size={18} color="var(--success)" />
                  <span style={{ fontWeight: 600 }}>Available Now</span>
                </div>
                <span style={{ color: "var(--success)", fontWeight: 700 }}>{vehiclesAvailable}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "rgba(245, 158, 11, 0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(245, 158, 11, 0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Clock size={18} color="var(--warning)" />
                  <span style={{ fontWeight: 600 }}>In Training</span>
                </div>
                <span style={{ color: "var(--warning)", fontWeight: 700 }}>{vehiclesInTraining}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "rgba(239, 68, 68, 0.05)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <AlertCircle size={18} color="var(--danger)" />
                  <span style={{ fontWeight: 600 }}>Service Due</span>
                </div>
                <span style={{ color: "var(--danger)", fontWeight: 700 }}>{serviceDueVehicles}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function MetricCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 className="text-muted" style={{ fontSize: "0.875rem", fontWeight: 500 }}>{title}</h3>
        <div style={{ padding: "0.5rem", background: "rgba(0,0,0,0.05)", borderRadius: "0.5rem" }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1, marginBottom: "0.5rem", color: "var(--text-primary)" }}>{value}</div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{trend}</div>
      </div>
    </div>
  );
}

function ClassItem({ time, student, trainer, vehicle, status }: { time: string, student: string, trainer: string, vehicle: string, status: string }) {
  const isProgress = status === "In Progress";
  const isCompleted = status === "Completed";
  const isOverdue = status === "Overdue";

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      padding: "1rem",
      border: "1px solid var(--border-color)",
      borderRadius: "1rem",
      background: isProgress ? "radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.1), transparent)" : "transparent",
      position: "relative",
      overflow: "hidden"
    }}>
      {isProgress && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "var(--success)" }} />}
      
      <div style={{ minWidth: "75px", textAlign: "right", fontWeight: 700, color: isProgress ? "var(--success)" : isCompleted ? "var(--text-muted)" : "var(--text-secondary)", fontSize: "0.95rem" }}>
        {time}
      </div>
      <div style={{ width: "1px", height: "40px", background: "var(--border-color)" }}></div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.35rem", color: isCompleted ? "var(--text-muted)" : "var(--text-primary)" }}>{student}</h4>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><UserCheck size={14} /> {trainer}</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><CarFront size={14} /> {vehicle}</span>
        </div>
      </div>
      <div>
        <span className={`badge ${isProgress ? 'badge-success' : isCompleted ? 'badge-secondary' : isOverdue ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: "0.75rem", fontWeight: 700 }}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function TestItem({ date, student, type }: { date: string, student: string, type: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.85rem",
      border: "1px solid var(--border-color)",
      borderRadius: "0.75rem",
      background: "var(--bg-secondary)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "36px", height: "36px",
          borderRadius: "10px",
          background: "rgba(59, 130, 246, 0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, color: "var(--accent-primary)", fontSize: "0.9rem"
        }}>
          {student.charAt(0)}
        </div>
        <div>
          <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.1rem", color: "var(--text-primary)" }}>{student}</h4>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{date}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span className="badge badge-accent" style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}>{type}</span>
        <Link href="/tests" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
