import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navLinks = ["Product", "Solutions", "Pricing", "Docs"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl"
    >
      <div
        className={`rounded-[16px] px-6 py-3 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-[0_8px_32px_hsl(var(--foreground)/0.12)]"
            : "bg-background/95 backdrop-blur-sm shadow-[0_4px_24px_hsl(var(--foreground)/0.08)]"
        }`}
      >
        <span className="font-barlow font-bold text-lg tracking-tight text-foreground">
          RicardianBase
        </span>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="font-barlow font-medium text-[14px] text-foreground/70 hover:text-foreground transition-colors"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden sm:flex items-center gap-3">
          <button className="font-barlow font-medium text-[14px] text-foreground/70 hover:text-foreground transition-colors px-4 py-2.5">
            Sign Up
          </button>
          <button className="flex items-center gap-2.5 bg-foreground text-background font-barlow font-medium text-[14px] pl-5 pr-3 py-2.5 rounded-full hover:opacity-90 transition-opacity">
            Connect Wallet
            <span className="w-7 h-7 rounded-full bg-background/15 flex items-center justify-center">
              <ArrowUpRight size={14} className="text-background" />
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
