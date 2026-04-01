import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-card",
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".cta-card", start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="cta-card relative overflow-hidden rounded-3xl border border-border bg-card">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Corner plus icons */}
            <PlusIcon className="absolute top-6 left-6 w-4 h-4 text-[hsl(140,38%,38%)]/20" />
            <PlusIcon className="absolute top-6 right-6 w-4 h-4 text-[hsl(140,38%,38%)]/20" />
            <PlusIcon className="absolute bottom-6 left-6 w-4 h-4 text-[hsl(140,38%,38%)]/20" />
            <PlusIcon className="absolute bottom-6 right-6 w-4 h-4 text-[hsl(140,38%,38%)]/20" />

            {/* Grid lines */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-[hsl(140,38%,38%)]/10" />
            <div className="absolute top-0 left-2/4 w-px h-full bg-[hsl(140,38%,38%)]/10" />
            <div className="absolute top-0 left-3/4 w-px h-full bg-[hsl(140,38%,38%)]/10" />
            <div className="absolute top-1/3 left-0 w-full h-px bg-[hsl(140,38%,38%)]/10" />
            <div className="absolute top-2/3 left-0 w-full h-px bg-[hsl(140,38%,38%)]/10" />

            {/* Subtle radial glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(140,38%,38%,0.06) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative flex flex-col items-center justify-center text-center px-8 py-20 md:py-28">
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-6">
              Get Started
            </span>

            <h2 className="text-3xl md:text-5xl font-medium text-foreground leading-tight max-w-2xl">
              Let your plans shape the{" "}
              <span className="font-instrument italic text-[hsl(140,38%,38%)]">future.</span>
            </h2>

            <p className="mt-5 text-muted-foreground text-lg max-w-xl">
              Start your free trial today. No credit card required.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="mailto:hello@ricardian.com"
                className="inline-flex items-center gap-2 border border-border bg-background text-foreground font-medium text-sm px-6 py-3 rounded-full hover:bg-secondary transition-colors"
              >
                Contact Sales
              </a>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-foreground text-background font-medium text-sm px-6 py-3 rounded-full hover:bg-foreground/90 transition-colors"
              >
                Get Started <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
