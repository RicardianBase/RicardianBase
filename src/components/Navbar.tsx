import { ArrowUpRight } from "lucide-react";

const navLinks = ["About", "Works", "Services", "Testimonial"];

const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl">
      <div className="bg-background/95 backdrop-blur-sm rounded-[16px] shadow-[0_4px_24px_hsl(var(--foreground)/0.08)] px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <span className="font-barlow font-bold text-lg tracking-tight text-foreground">
          Logoisum
        </span>

        {/* Center Links */}
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

        {/* CTA */}
        <button className="hidden sm:flex items-center gap-2.5 bg-foreground text-background font-barlow font-medium text-[14px] pl-5 pr-3 py-2.5 rounded-full hover:opacity-90 transition-opacity">
          Book A Free Meeting
          <span className="w-7 h-7 rounded-full bg-background/15 flex items-center justify-center">
            <ArrowUpRight size={14} className="text-background" />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
