import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useWallet } from "@/contexts/WalletContext";
import {
  LayoutDashboard, FileText, Wallet, AlertTriangle, Settings, Search,
  Bell, ChevronLeft, ChevronRight, Plus, Menu, Copy, Check, LogOut, ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
  const notificationCount = 0;

  const initials = user?.display_name
    ? user.display_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
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

  return (
    <div className="min-h-screen bg-[hsl(230,25%,96%)] flex" style={{ fontFamily: "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 bg-white border-r border-[hsl(230,20%,92%)] flex flex-col transition-all duration-300 ease-out ${
          collapsed ? "w-[72px]" : "w-[240px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[hsl(230,20%,94%)]">
          {!collapsed && (
            <span className="text-base font-semibold text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Ricardian
            </span>
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
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[hsl(230,20%,92%)] h-16 flex items-center px-4 md:px-8 gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 rounded-full hover:bg-[hsl(230,25%,95%)] flex items-center justify-center"
          >
            <Menu size={20} className="text-muted-foreground" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search contracts, milestones..."
                className="w-full bg-[hsl(230,25%,96%)] border-0 rounded-full pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notification */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative w-9 h-9 rounded-full hover:bg-[hsl(230,25%,95%)] flex items-center justify-center transition-colors outline-none">
                  <Bell size={18} className="text-muted-foreground" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(340,80%,55%)] rounded-full" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-xl p-0">
                <div className="px-4 py-3 border-b border-[hsl(230,20%,94%)]">
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                </div>
                <div className="py-8 text-center">
                  <Bell size={24} className="text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No new notifications</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  title="Wallet menu"
                  className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-medium text-white hover:bg-emerald-600 transition-colors outline-none"
                >
                  {initials}
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
