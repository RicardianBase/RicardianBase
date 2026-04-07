import { ArrowUpRight, Menu, X, Wallet, ChevronDown, Copy, Check, LogOut, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isConnected, address, openModal, disconnect, user } = useWallet();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isConnected) {
      openModal();
    } else {
      window.location.href = "/dashboard";
    }
  };

  const [copied, setCopied] = useState(false);

  const walletLabel = user?.username
    ? `@${user.username}`
    : address
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
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div className="bg-background/95 backdrop-blur-sm rounded-[16px] shadow-[0_4px_24px_hsl(var(--foreground)/0.08)] px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-barlow font-bold text-lg tracking-tight text-foreground">
          ⬡ Ricardian
        </a>

        {/* Center Links — Desktop */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="font-barlow font-medium text-[13px] text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA + Connect + Mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Connect Wallet button */}
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden sm:flex items-center gap-2 border border-[hsl(140,38%,38%)]/30 bg-[hsl(140,38%,38%)]/5 text-[hsl(140,38%,38%)] font-barlow font-medium text-[13px] px-4 py-2.5 rounded-full hover:bg-[hsl(140,38%,38%)]/10 transition-colors outline-none">
                  <Wallet size={14} />
                  {walletLabel}
                  <ChevronDown size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
                <div className="p-3">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wide">Connected on Base</p>
                  <p className="text-xs font-mono text-foreground mt-1 break-all">{address}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopy} className="flex items-center gap-2 text-xs px-3 py-2 cursor-pointer">
                  {copied ? <Check size={12} className="text-[hsl(140,38%,38%)]" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy Address"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open(`https://basescan.org/address/${address}`, "_blank", "noopener,noreferrer")}
                  className="flex items-center gap-2 text-xs px-3 py-2 cursor-pointer"
                >
                  <ExternalLink size={12} />
                  View on Basescan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { window.location.href = "/dashboard"; }} className="flex items-center gap-2 text-xs px-3 py-2 cursor-pointer">
                  <Wallet size={12} />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnect} className="flex items-center gap-2 text-xs px-3 py-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut size={12} />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={openModal}
              className="hidden sm:flex items-center gap-2 border border-border text-foreground/70 font-barlow font-medium text-[13px] px-4 py-2.5 rounded-full hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Wallet size={14} />
              Connect
            </button>
          )}

          {/* Get Started */}
          <button
            onClick={handleGetStarted}
            className="hidden sm:flex items-center gap-2.5 bg-foreground text-background font-barlow font-medium text-[13px] pl-5 pr-3 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Get Started
            <span className="w-7 h-7 rounded-full bg-background/15 flex items-center justify-center">
              <ArrowUpRight size={14} className="text-background" />
            </span>
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden mt-2 bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => { openModal(); setMobileOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-2"
              >
                <Wallet size={14} />
                {isConnected ? walletLabel : "Connect Wallet"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
