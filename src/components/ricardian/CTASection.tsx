import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-background py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-3xl bg-foreground p-12 md:p-20 text-center ${isInView ? "animate-fade-in-up" : ""}`}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />

          <div className="relative">
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-background/50 mb-6">
              Get Started
            </span>
            <h2 className="text-3xl md:text-5xl font-medium text-background leading-tight max-w-2xl mx-auto">
              Ready to transform your{" "}
              <span className="font-instrument italic text-emerald-400">enterprise contracting?</span>
            </h2>
            <p className="mt-5 text-background/60 text-lg max-w-xl mx-auto">
              Join the future of trustless, instant, and legally compliant smart contracts on Base blockchain.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-emerald-500 text-white font-medium text-sm px-8 py-3.5 rounded-full hover:bg-emerald-600 transition-colors"
              >
                Launch App <ArrowRight size={16} />
              </Link>
              <a
                href="#faq"
                className="inline-flex items-center gap-2 bg-background/10 text-background font-medium text-sm px-8 py-3.5 rounded-full hover:bg-background/20 transition-colors border border-background/10"
              >
                Learn More
              </a>
            </div>

            <p className="mt-8 text-xs text-background/40">
              No credit card required · Free beta access · Base mainnet
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
