import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SubscribeForm = () => {
  const [email, setEmail] = useState("");
  const handleSubscribe = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("You've been subscribed! We'll keep you updated.");
    setEmail("");
  };
  return (
    <div className="mt-6 flex">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
        placeholder="Your email"
        className="flex-1 text-sm bg-background border border-border rounded-l-full px-4 py-2.5 outline-none focus:border-foreground/30 transition-colors"
      />
      <button
        onClick={handleSubscribe}
        className="bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-r-full hover:opacity-90 transition-opacity flex items-center gap-1"
      >
        Subscribe <ArrowRight size={14} />
      </button>
    </div>
  );
};

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
      { label: "Smart Contracts", href: "#services" },
      { label: "Escrow", href: "#services" },
      { label: "Milestones", href: "#services" },
      { label: "Auto-Payments", href: "#services" },
    ],
  },
  {
    title: "Socials",
    isSocial: true,
    links: [
      { label: "X / Twitter", href: "https://x.com/RicardianBase" },
      { label: "Telegram", href: "https://t.me/ricardianportal" },
      { label: "GitHub", href: "https://github.com/RicardianBase" },
    ],
  },
];

const ComingSoonPopup = ({ name }: { name: string }) => (
  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-10 animate-fade-in">
    {name} — Coming Soon
    <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
  </span>
);

const SocialLink = ({ label, href }: { label: string; href: string }) => {
  const [show, setShow] = useState(false);

  if (href !== "#") {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {label}
        </a>
      </li>
    );
  }

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

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const socials = [
  { icon: <XIcon />, name: "X / Twitter", href: "https://x.com/RicardianBase" },
  { icon: <TelegramIcon />, name: "Telegram", href: "https://t.me/ricardianportal" },
  { icon: <GitHubIcon />, name: "GitHub", href: "https://github.com/RicardianBase" },
];

const SocialButton = ({ social }: { social: { icon: JSX.Element; name: string; href: string } }) => {
  const [show, setShow] = useState(false);

  if (social.href !== "#") {
    return (
      <a
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.name}
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        {social.icon}
      </a>
    );
  }

  return (
    <div className="relative">
      {show && <ComingSoonPopup name={social.name} />}
      <button
        onClick={() => { setShow(true); setTimeout(() => setShow(false), 2000); }}
        aria-label={social.name}
        className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        {social.icon}
      </button>
    </div>
  );
};

const RicardianFooter = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold text-foreground">⬡ Ricardian</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              Hybrid Ricardian contracts on Base blockchain. Instant stablecoin payments, automated escrow, and legally binding smart contracts.
            </p>

            <SubscribeForm />
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.isSocial
                  ? col.links.map((link) => (
                      <SocialLink key={link.label} label={link.label} href={link.href} />
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
            <div className="flex gap-2">
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
