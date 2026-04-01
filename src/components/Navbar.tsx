import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div className="bg-background/95 backdrop-blur-sm rounded-[16px] shadow-[0_4px_24px_hsl(var(--foreground)/0.08)] px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-barlow font-bold text-lg tracking-tight text-foreground">
          ⬡ RicardianBase
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

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#cta"
            onClick={(e) => handleClick(e, "#cta")}
            className="hidden sm:flex items-center gap-2.5 bg-foreground text-background font-barlow font-medium text-[13px] pl-5 pr-3 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Get Started
            <span className="w-7 h-7 rounded-full bg-background/15 flex items-center justify-center">
              <ArrowUpRight size={14} className="text-background" />
            </span>
          </a>
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
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
