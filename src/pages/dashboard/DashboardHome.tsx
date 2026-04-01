import { TrendingUp, TrendingDown, FileText, DollarSign, Clock, CheckCircle, ArrowUpRight } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const stats = [
  {
    label: "Active Contracts", value: "24", trend: "+3", up: true, icon: FileText,
    gradient: "from-[hsl(250,45%,60%)] to-[hsl(280,50%,65%)]",
    shadow: "shadow-[hsl(250,45%,60%)]/25",
  },
  {
    label: "Total Value", value: "$142.5k", trend: "+12.4%", up: true, icon: DollarSign,
    gradient: "from-[hsl(220,55%,55%)] to-[hsl(200,60%,55%)]",
    shadow: "shadow-[hsl(220,55%,55%)]/25",
  },
  {
    label: "Pending Reviews", value: "8", trend: "-2", up: false, icon: Clock,
    gradient: "from-[hsl(290,40%,60%)] to-[hsl(320,50%,65%)]",
    shadow: "shadow-[hsl(290,40%,60%)]/25",
  },
  {
    label: "Completed", value: "156", trend: "+18", up: true, icon: CheckCircle,
    gradient: "from-[hsl(200,55%,50%)] to-[hsl(230,50%,60%)]",
    shadow: "shadow-[hsl(200,55%,50%)]/25",
  },
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
        <h1 className="text-2xl md:text-3xl font-medium text-foreground">Good morning, John 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your contracts today.</p>
      </div>

      {/* Stats — colorful gradient cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 shadow-lg ${s.shadow} hover:-translate-y-0.5 transition-all duration-300 ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: `${0.15 + i * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <s.icon size={18} className="text-white" />
              </div>
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-white/90">
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.trend}
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">{s.value}</p>
            <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Wallet balance card */}
      <div
        className={`bg-gradient-to-r from-[hsl(240,35%,25%)] to-[hsl(260,40%,35%)] rounded-2xl p-6 md:p-8 shadow-lg ${isInView ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "0.25s" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <DollarSign size={20} className="text-white/80" />
            </div>
            <p className="text-3xl md:text-4xl font-semibold text-white">$55,300.00</p>
            <p className="text-sm text-white/60 mt-1">Wallet Balance</p>
            <p className="text-xs text-emerald-300 mt-1">+3.2% from last week</p>
          </div>
          <button className="bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/20 transition-colors border border-white/10">
            Change →
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div
          className={`lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-base font-medium text-foreground mb-5">Recent Activity</h2>
          <div className="space-y-0">
            {activities.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 py-3.5 ${i < activities.length - 1 ? "border-b border-[hsl(230,20%,94%)]" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(250,35%,85%)] to-[hsl(220,40%,80%)] flex items-center justify-center text-xs font-medium text-[hsl(250,50%,40%)] flex-shrink-0">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{a.name}</span>{" "}
                    {a.action}{" "}
                    <span className="font-medium text-foreground">{a.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{a.time}</p>
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
          <h2 className="text-base font-medium text-foreground mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((a) => (
              <button
                key={a.label}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  a.primary
                    ? "bg-gradient-to-r from-[hsl(250,40%,55%)] to-[hsl(220,50%,55%)] text-white hover:shadow-lg hover:shadow-[hsl(240,40%,60%)]/20"
                    : "bg-[hsl(230,25%,96%)] text-foreground hover:bg-[hsl(230,25%,93%)]"
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
