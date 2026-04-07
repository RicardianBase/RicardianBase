import { useState, useMemo, useCallback } from "react";
import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import {
  LayoutDashboard, FileText, Wallet, AlertTriangle, Settings, Search,
  Bell, ChevronLeft, ChevronRight, Plus, Menu, Copy, Check, LogOut, ExternalLink,
  DollarSign, Flag, CheckCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/api/useProfile";
import { useDashboardActivity } from "@/hooks/api/useDashboard";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import UsernameOnboarding from "./UsernameOnboarding";
import type { ActivityLog } from "@/types/api";

const NOTIF_SEEN_KEY = "ricardian_notif_seen_at";

const NOTIF_ACTIONS: Record<string, { category: string; icon: typeof Bell }> = {
  milestone_submitted: { category: "milestones", icon: CheckCircle },
  milestone_approved: { category: "milestones", icon: CheckCircle },
  milestone_rejected: { category: "milestones", icon: AlertTriangle },
  milestone_in_progress: { category: "milestones", icon: CheckCircle },
  milestone_paid: { category: "payments", icon: DollarSign },
  escrow_funded: { category: "payments", icon: DollarSign },
  escrow_released: { category: "payments", icon: DollarSign },
  payment_released: { category: "payments", icon: DollarSign },
  dispute_raised: { category: "disputes", icon: Flag },
  dispute_resolved: { category: "disputes", icon: Flag },
  dispute_escalated: { category: "disputes", icon: Flag },
};

function formatTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/contracts", icon: FileText, label: "Contracts", end: false },
  { to: "/dashboard/wallet", icon: Wallet, label: "Wallet", end: false },
  { to: "/dashboard/disputes", icon: AlertTriangle, label: "Disputes", end: false },
  { to: "/dashboard/settings", icon: Settings, label: "Settings", end: false },
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, disconnect, address } = useWallet();
  const [copied, setCopied] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [onboardingDone, setOnboardingDone] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: activity } = useDashboardActivity();
  const needsUsername = !profileLoading && profile && !profile.username && !onboardingDone;

  const notifications = useMemo(() => {
    if (!activity) return [];
    const prefs = profile?.notification_prefs ?? {};
    return activity
      .filter((log: ActivityLog) => {
        const config = NOTIF_ACTIONS[log.action];
        if (!config) return false;
        return prefs[config.category] !== false;
      })
      .slice(0, 20);
  }, [activity, profile?.notification_prefs]);

  const [lastSeenAt, setLastSeenAt] = useState(() =>
    localStorage.getItem(NOTIF_SEEN_KEY) || "1970-01-01T00:00:00Z"
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => new Date(n.created_at) > new Date(lastSeenAt)).length,
    [notifications, lastSeenAt],
  );

  const handleOpenNotifications = useCallback(() => {
    if (notifications.length > 0) {
      const latest = notifications[0].created_at;
      localStorage.setItem(NOTIF_SEEN_KEY, latest);
      setLastSeenAt(latest);
    }
  }, [notifications]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchValue.trim();
    navigate(`/dashboard/contracts${q ? `?search=${encodeURIComponent(q)}` : ""}`);
  };

  const displayLabel = profile?.username || user?.display_name || null;
  const initials = displayLabel
    ? displayLabel.slice(0, 2).toUpperCase()
    : address
    ? `${address.slice(2, 3)}${address.slice(-1)}`.toUpperCase()
    : "??";

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (needsUsername) {
    return <UsernameOnboarding onComplete={() => setOnboardingDone(true)} />;
  }

  return (
    <div className="min-h-screen bg-[hsl(230,25%,96%)] dark:bg-[hsl(220,20%,7%)] flex" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 bg-white dark:bg-[hsl(220,18%,10%)] border-r border-[hsl(230,20%,92%)] dark:border-[hsl(220,15%,18%)] flex flex-col transition-all duration-300 ease-out ${
          collapsed ? "w-[72px]" : "w-[240px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[hsl(230,20%,94%)]">
          {!collapsed && (
            <Link to="/" className="text-base font-semibold text-foreground hover:opacity-80 transition-opacity" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Ricardian
            </Link>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="w-8 h-8 rounded-full hover:bg-[hsl(230,25%,95%)] flex items-center justify-center transition-colors"
          >
            {collapsed ? <ChevronRight size={16} className="text-muted-foreground" /> : <ChevronLeft size={16} className="text-muted-foreground" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-muted-foreground hover:bg-[hsl(230,25%,95%)] hover:text-foreground"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Create button */}
        <div className="p-3 border-t border-[hsl(230,20%,94%)]">
          <NavLink
            to="/dashboard/contracts/new"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors ${collapsed ? "justify-center" : ""}`}
          >
            <Plus size={18} />
            {!collapsed && <span>New Contract</span>}
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[hsl(220,18%,10%)]/80 backdrop-blur-md border-b border-[hsl(230,20%,92%)] dark:border-[hsl(220,15%,18%)] h-16 flex items-center px-4 md:px-8 gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 rounded-full hover:bg-[hsl(230,25%,95%)] flex items-center justify-center"
          >
            <Menu size={20} className="text-muted-foreground" />
          </button>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search contracts, milestones..."
                className="w-full bg-[hsl(230,25%,96%)] border-0 rounded-full pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 ml-auto">
            {/* Theme toggle */}
            <div className="flex items-center gap-1 opacity-40 cursor-not-allowed" title="Coming soon">
              <Moon size={18} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground/60 font-medium">Soon</span>
            </div>

            {/* Notification */}
            <DropdownMenu onOpenChange={(open) => { if (open) handleOpenNotifications(); }}>
              <DropdownMenuTrigger asChild>
                <button className="relative w-9 h-9 rounded-full hover:bg-[hsl(230,25%,95%)] flex items-center justify-center transition-colors outline-none">
                  <Bell size={18} className="text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-[hsl(340,80%,55%)] rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-medium text-white px-1">{unreadCount > 9 ? "9+" : unreadCount}</span>
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl p-0">
                <div className="px-4 py-3 border-b border-[hsl(230,20%,94%)]">
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell size={24} className="text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => {
                      const config = NOTIF_ACTIONS[n.action];
                      const Icon = config?.icon ?? Bell;
                      const isUnread = new Date(n.created_at) > new Date(lastSeenAt);
                      return (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-[hsl(230,20%,96%)] last:border-0 ${isUnread ? "bg-emerald-50/50 dark:bg-emerald-500/5" : ""}`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUnread ? "bg-emerald-100 text-emerald-600" : "bg-[hsl(230,25%,94%)] text-muted-foreground"}`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-foreground leading-relaxed">{n.description}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{formatTimeAgo(n.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Username + Avatar */}
            <span className="hidden sm:block text-xs font-medium text-foreground">
              {profile?.username ? `@${profile.username}` : truncatedAddress}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  title="Wallet menu"
                  className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-medium text-white hover:bg-emerald-600 transition-colors outline-none overflow-hidden"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-xl shadow-xl">
                <div className="p-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Connected on Base</p>
                  <p className="text-xs font-mono text-foreground mt-1 break-all">{address || truncatedAddress}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopy} className="flex items-center gap-2 text-xs px-3 py-2 cursor-pointer">
                  {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy Address"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open(`https://basescan.org/address/${address}`, "_blank", "noopener,noreferrer")}
                  className="flex items-center gap-2 text-xs px-3 py-2 cursor-pointer"
                >
                  <ExternalLink size={12} />
                  View on Basescan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => { window.location.href = "/dashboard/settings"; }}
                  className="flex items-center gap-2 text-xs px-3 py-2 cursor-pointer"
                >
                  <Settings size={12} />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnect} className="flex items-center gap-2 text-xs px-3 py-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut size={12} />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
