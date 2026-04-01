import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroProduct from "@/assets/hero-product.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-[#0a0a0a] min-h-[90vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroProduct}
          alt="RicardianBase smart contract platform"
          className="w-full h-full object-cover opacity-60"
          width={1280}
          height={720}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <span className="text-white text-lg font-semibold tracking-tight">⬡ RicardianBase</span>
        <div className="hidden md:flex items-center gap-8">
          {["Product", "Solutions", "Resources", "Pricing", "Contact"].map((link) => (
            <a key={link} href="#" className="text-sm text-white/60 hover:text-white transition-colors">{link}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="hidden sm:block text-sm text-white/80 hover:text-white transition-colors">Login</a>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-blue-500 transition-colors"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20 md:pb-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.05] tracking-tight">
            Scale Contracts<br />
            With Smarter<br />
            Payments
          </h1>

          {/* Floating card */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">$</div>
            <div>
              <p className="text-white text-sm font-medium">Milestone Payment</p>
              <p className="text-white/50 text-xs">Auto-executed</p>
            </div>
            <span className="text-white font-semibold text-sm ml-4">$12,500</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mt-16 gap-6">
          <p className="text-sm text-white/50 max-w-xs leading-relaxed">
            From hiring managers to global enterprises, our platform makes contractor payments instant, automatic, and legally binding on Base blockchain.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-white border border-white/20 rounded-full px-5 py-2.5 hover:bg-white/10 transition-colors"
          >
            Talk to Sales
            <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
              <ArrowRight size={14} className="text-white" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
