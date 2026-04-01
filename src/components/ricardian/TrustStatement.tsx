import { useRef, useEffect, useState } from "react";
import { Shield, FileText, Zap, Lock, Layers } from "lucide-react";

const features = [
  { icon: Shield, title: "Smart Escrow", desc: "Milestone-based escrow with USDC & PYUSD stablecoins." },
  { icon: FileText, title: "Ricardian Contracts", desc: "Cryptographic hash linking legal prose to smart contracts." },
  { icon: Zap, title: "Auto-Execution", desc: "Approve milestones and trigger instant on-chain settlement." },
  { icon: Layers, title: "Compliance", desc: "Enterprise-grade KYC/AML verification built in." },
  { icon: Lock, title: "Base L2", desc: "Reliable and performant blockchain infrastructure." },
];

const labels = ["SMART ESCROW", "RICARDIAN CONTRACTS", "AUTO-EXECUTION", "KYC/AML", "BASE L2"];
const rightLabels = ["ENTERPRISE TEMPLATES", "STABLECOIN PAYMENTS", "BUILT ON BASE"];

const PlatformVideo = ({ visible }: { visible: boolean }) => {
  return (
    <div
      className="relative w-[340px] h-[300px] mx-auto transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover rounded-2xl"
        src="/videos/about-animation.mp4"
      />
      {/* Radial blur overlay to blend with white background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background)) 75%)",
        }}
      />
    </div>
  );
};

const TrustStatement = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-background pt-4 pb-12 md:pt-6 md:pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main card */}
        <div
          className="bg-card border border-border rounded-3xl p-10 md:p-16 transition-all duration-700 ease-out shadow-sm"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Header area */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
            <div className="max-w-xl">
              <span className="text-xs font-medium text-[hsl(140,40%,40%)] tracking-wider uppercase flex items-center gap-2 mb-4">
                <span className="text-sm">✦</span> About RicardianBase
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-[42px] font-normal text-foreground leading-[1.15]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                The first platform to merge{" "}
                <em className="text-[hsl(140,38%,38%)]">legal contracts</em> with{" "}
                <em className="text-[hsl(150,40%,42%)]">smart contracts</em>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed lg:pt-10">
              RicardianBase is enterprise-grade infrastructure for hiring managers, procurement teams, and tech contractors. We eliminate payment friction and contract risk by fusing legally-binding prose with on-chain escrow execution on the Base blockchain.
            </p>
          </div>

          {/* About text */}
          <div
            className="mb-16 max-w-3xl transition-all duration-700 ease-out"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.2s",
            }}
          >
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Every contract on our platform simultaneously generates a human-readable legal document (compliant with ESIGN Act) and a matching Base L2 smart contract. A cryptographic SHA-256 hash permanently links the two, making any tampering instantly detectable.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Payments flow through milestone-based escrow in USDC and PYUSD stablecoins — always worth $1 USD, zero volatility. When a milestone is approved, funds release automatically. No invoices, no AP departments, no 30-day payment terms. Just click approve and the contractor gets paid in seconds.
            </p>
          </div>

          {/* Illustration area */}
          <div className="relative flex items-center justify-center py-8 md:py-12">
            {/* Left labels */}
            <div className="hidden md:flex flex-col gap-3 absolute left-0 top-1/2 -translate-y-1/2">
              {labels.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 transition-all duration-500 ease-out"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-20px)",
                    transitionDelay: `${0.4 + i * 0.1}s`,
                  }}
                >
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wider">{l}</span>
                  <div className="w-8 h-px bg-gradient-to-r from-[hsl(140,35%,55%)] to-transparent" />
                </div>
              ))}
            </div>

            <PlatformIllustration visible={inView} />

            {/* Right labels */}
            <div className="hidden md:flex flex-col gap-4 absolute right-0 top-1/2 -translate-y-1/2">
              {rightLabels.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 transition-all duration-500 ease-out"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(20px)",
                    transitionDelay: `${0.6 + i * 0.1}s`,
                  }}
                >
                  <div className="w-8 h-px bg-gradient-to-l from-[hsl(150,40%,50%)] to-transparent" />
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wider">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature pills row */}
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-12 px-2"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s ease-out 0.8s",
          }}
        >
          {features.map((f, i) => (
            <div key={i} className="flex flex-col gap-2 group">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[hsl(140,30%,92%)] to-[hsl(150,35%,88%)] flex items-center justify-center group-hover:from-[hsl(140,35%,85%)] group-hover:to-[hsl(150,38%,80%)] transition-all duration-300">
                  <f.icon size={14} strokeWidth={1.5} className="text-[hsl(140,40%,38%)]" />
                </div>
                <span className="text-sm font-medium text-foreground">{f.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStatement;
