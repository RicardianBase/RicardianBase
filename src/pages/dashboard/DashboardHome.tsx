import { TrendingUp, TrendingDown, FileText, DollarSign, Clock, CheckCircle, ArrowUpRight } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const stats = [
  { label: "Active Contracts", value: "24", trend: "+3", up: true, icon: FileText },
  { label: "Total Value", value: "$142.5k", trend: "+12.4%", up: true, icon: DollarSign },
  { label: "Pending Reviews", value: "8", trend: "-2", up: false, icon: Clock },
  { label: "Completed", value: "156", trend: "+18", up: true, icon: CheckCircle },
];

const activities = [
  { avatar: "AC", name: "Alice Chen", action: "approved milestone 3 on", target: "Brand Redesign", time: "2 min ago" },
  { avatar: "BM", name: "Bob Martinez", action: "submitted deliverable for", target: "API Integration", time: "15 min ago" },
  { avatar: "CL", name: "Carol Liu", action: "created new contract", target: "Mobile App MVP", time: "1 hr ago" },
  { avatar: "DK", name: "David Kim", action: "funded escrow for", target: "Marketing Campaign", time: "3 hrs ago" },
  { avatar: "EP", name: "Elena Park", action: "requested changes on", target: "UI Audit", time: "5 hrs ago" },
];

const quickActions = [
  { label: "Create Contract", primary: true },
  { label: "Fund Escrow", primary: false },
  { label: "Review Milestones", primary: false },
  { label: "Export Report", primary: false },
];

const DashboardHome = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <div ref={ref} className="space-y-6">
      {/* Welcome */}
      <div
        className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "0.1s" }}
      >
        <h1 className="text-2xl md:text-3xl font-medium text-gray-900">Good morning, John 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your contracts today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: `${0.15 + i * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
                <s.icon size={18} className="text-gray-500" />
              </div>
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.trend}
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div
          className={`lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-base font-medium text-gray-900 mb-5">Recent Activity</h2>
          <div className="space-y-0">
            {activities.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 py-3.5 ${i < activities.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{a.name}</span>{" "}
                    {a.action}{" "}
                    <span className="font-medium text-gray-900">{a.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div
          className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.35s" }}
        >
          <h2 className="text-base font-medium text-gray-900 mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  a.primary
                    ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {a.label}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
