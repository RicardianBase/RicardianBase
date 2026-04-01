import { ArrowRight } from "lucide-react";
import { useState } from "react";

const columns = [
  { title: "Product", links: ["Smart Contracts", "Escrow", "Milestones", "Auto-Payments"] },
  { title: "Solutions", links: ["Procurement", "Legal Ops", "Finance", "Contractors"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
  { title: "Legal", links: ["Terms & Conditions", "Privacy Policy"] },
];

const socials = [
  { label: "𝕏", name: "X / Twitter" },
  { label: "TG", name: "Telegram" },
  { label: "GH", name: "GitHub" },
];

const ComingSoonPopup = ({ name, onClose }: { name: string; onClose: () => void }) => (
  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-10 animate-fade-in">
    {name} — Coming Soon
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
  </div>
);

const SocialButton = ({ social }: { social: { label: string; name: string } }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      {show && <ComingSoonPopup name={social.name} onClose={() => setShow(false)} />}
      <button
        onClick={() => { setShow(true); setTimeout(() => setShow(false), 2000); }}
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[10px] text-muted-foreground hover:bg-secondary transition-colors"
      >
        {social.label}
      </button>
    </div>
  );
};

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

const RicardianFooter = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-foreground">⬡ RicardianBase</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              Hybrid Ricardian contracts on Base blockchain. Instant stablecoin payments, automated escrow, and legally binding smart contracts.
            </p>

            {/* Nav links */}
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-6 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 text-sm bg-background border border-border rounded-l-full px-4 py-2.5 outline-none focus:border-foreground/30 transition-colors"
              />
              <button className="bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-r-full hover:opacity-90 transition-opacity flex items-center gap-1">
                Subscribe <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} RicardianBase. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <div className="flex gap-2 ml-2">
              {socials.map((s) => (
                <SocialButton key={s.label} social={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RicardianFooter;
