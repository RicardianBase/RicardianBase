import { ArrowRight } from "lucide-react";
import { useState } from "react";

const columns = [
  {
    title: "Navigate",
    links: [
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Smart Contracts", href: "#" },
      { label: "Escrow", href: "#" },
      { label: "Milestones", href: "#" },
      { label: "Auto-Payments", href: "#" },
    ],
  },
  {
    title: "Socials",
    isSocial: true,
    links: [
      { label: "X / Twitter", href: "#" },
      { label: "Telegram", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];

const ComingSoonPopup = ({ name }: { name: string }) => (
  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-10 animate-fade-in">
    {name} — Coming Soon
    <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
  </span>
);

const SocialLink = ({ label }: { label: string }) => {
  const [show, setShow] = useState(false);

  return (
    <li className="relative">
      {show && <ComingSoonPopup name={label} />}
      <button
        onClick={() => { setShow(true); setTimeout(() => setShow(false), 2000); }}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
      </button>
    </li>
  );
};

const handleScrollClick = (e: React.MouseEvent, href: string) => {
  if (href === "#") return;
  e.preventDefault();
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const socials = [
  { label: "𝕏", name: "X / Twitter" },
  { label: "TG", name: "Telegram" },
  { label: "GH", name: "GitHub" },
];

const SocialButton = ({ social }: { social: { label: string; name: string } }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      {show && <ComingSoonPopup name={social.name} />}
      <button
        onClick={() => { setShow(true); setTimeout(() => setShow(false), 2000); }}
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[10px] text-muted-foreground hover:bg-secondary transition-colors"
      >
        {social.label}
      </button>
    </div>
  );
};

const RicardianFooter = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-foreground">⬡ Ricardian</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              Hybrid Ricardian contracts on Base blockchain. Instant stablecoin payments, automated escrow, and legally binding smart contracts.
            </p>

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
                {col.isSocial
                  ? col.links.map((link) => (
                      <SocialLink key={link.label} label={link.label} />
                    ))
                  : col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => handleScrollClick(e, link.href)}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))
                }
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Ricardian. All rights reserved.</p>
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
