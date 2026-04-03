import { TrendingUp, FileText, DollarSign, Clock, CheckCircle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useWallet } from "@/contexts/WalletContext";
import { useDashboardStats, useDashboardActivity } from "@/hooks/api/useDashboard";
import { useWalletBalances } from "@/hooks/api/useWallet";
import type { DashboardStats, ActivityLog } from "@/types/api";

const statConfig = [
  { key: "activeContracts" as const, label: "Active Contracts", icon: FileText },
  { key: "totalValue" as const, label: "Total Value", icon: DollarSign, isCurrency: true },
  { key: "pendingReviews" as const, label: "Pending Reviews", icon: Clock },
  { key: "completedContracts" as const, label: "Completed", icon: CheckCircle },
];

const quickActions = [
  { label: "Create Contract", href: "/dashboard/contracts/new", primary: true },
  { label: "View Contracts", href: "/dashboard/contracts", primary: false },
  { label: "Review Milestones", href: "/dashboard/contracts", primary: false },
  { label: "View Wallet", href: "/dashboard/wallet", primary: false },
];

function formatStatValue(key: keyof DashboardStats, value: number, isCurrency?: boolean) {
  if (isCurrency) {
    return value >= 1000
      ? `$${(value / 1000).toFixed(1)}k`
      : `$${value.toFixed(0)}`;
  }
  return String(value);
}

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function parseActivityDescription(log: ActivityLog) {
  return {
    avatar: log.action.slice(0, 2).toUpperCase(),
    description: log.description,
    time: formatTimeAgo(log.created_at),
  };
}

const neumorphic = "bg-white rounded-2xl border border-border shadow-[6px_6px_12px_hsl(0_0%_0%/0.04),-4px_-4px_10px_hsl(0_0%_100%/0.8)]";

const DashboardHome = () => {
  const { ref, isInView } = useInViewAnimation();
  const { user } = useWallet();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useDashboardActivity();
  const { data: balances } = useWalletBalances();

  const displayName = user?.display_name || "there";
  const totalBalance = balances
    ? balances.reduce((sum, b) => sum + parseFloat(b.balance), 0)
    : 0;

  return (
    <div ref={ref} className="space-y-6">
      {/* Welcome */}
      <div
        className={`${neumorphic} p-6 md:p-8 ${isInView ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "0.1s" }}
      >
        <h1 className="text-2xl md:text-3xl font-medium text-foreground">Welcome, {displayName} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your contracts today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfig.map((s, i) => (
          <div
            key={s.key}
            className={`${neumorphic} p-5 hover:-translate-y-0.5 transition-all duration-300 ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: `${0.15 + i * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <s.icon size={18} className="text-emerald-600" />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                <TrendingUp size={12} />
              </span>
            </div>
            {statsLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <p className="text-2xl font-semibold text-foreground">
                {stats ? formatStatValue(s.key, stats[s.key], s.isCurrency) : "—"}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Wallet balance card */}
      <div
        className={`${neumorphic} p-6 md:p-8 border-l-4 border-l-emerald-500 ${isInView ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "0.25s" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <p className="text-3xl md:text-4xl font-semibold text-foreground">
              ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Wallet Balance</p>
          </div>
          <Link
            to="/dashboard/wallet"
            className="bg-emerald-500 text-white text-xs font-medium px-5 py-2.5 rounded-full hover:bg-emerald-600 transition-colors"
          >
            Manage →
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div
          className={`lg:col-span-2 ${neumorphic} p-6 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-base font-medium text-foreground mb-5">Recent Activity</h2>
          {activitiesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-0">
              {activities.map((log, i) => {
                const parsed = parseActivityDescription(log);
                return (
                  <div
                    key={log.id}
                    className={`flex items-start gap-3 py-3.5 ${i < activities.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700 flex-shrink-0">
                      {parsed.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">{parsed.description}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{parsed.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">No recent activity</p>
          )}
        </div>

        {/* Quick actions */}
        <div
          className={`${neumorphic} p-6 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.35s" }}
        >
          <h2 className="text-base font-medium text-foreground mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.href}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  a.primary
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {a.label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
