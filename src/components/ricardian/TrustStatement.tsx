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

const PlatformIllustration = ({ visible }: { visible: boolean }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, [visible]);

  const layers = [
    { label: "Payment Layer", gradient: "from-[hsl(140,40%,45%)] to-[hsl(160,45%,50%)]", yOff: 0, delay: 0.2 },
    { label: "Ricardian Link", gradient: "from-[hsl(150,38%,42%)] to-[hsl(130,40%,48%)]", yOff: -36, delay: 0.4 },
    { label: "Smart Contract", gradient: "from-[hsl(120,35%,40%)] to-[hsl(145,40%,45%)]", yOff: -72, delay: 0.6 },
  ];

  return (
    <div className="relative w-[340px] h-[300px] mx-auto">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000"
        style={{
          background: "radial-gradient(circle, hsl(140,40%,55%,0.12) 0%, transparent 70%)",
          opacity: visible ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${visible ? 1.2 : 0.5})`,
        }}
      />

      {/* Orbital rings */}
      {visible && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.18 }}>
          <circle cx="170" cy="150" r="80" fill="none" stroke="hsl(140,35%,50%)" strokeWidth="0.5" strokeDasharray="4 4">
            <animateTransform attributeName="transform" type="rotate" from="0 170 150" to="360 170 150" dur="20s" repeatCount="indefinite" />
          </circle>
          <circle cx="170" cy="150" r="110" fill="none" stroke="hsl(150,40%,55%)" strokeWidth="0.5" strokeDasharray="2 6">
            <animateTransform attributeName="transform" type="rotate" from="360 170 150" to="0 170 150" dur="30s" repeatCount="indefinite" />
          </circle>
        </svg>
      )}

      {/* Orbital particles */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * 360;
        const radius = 100 + (i % 3) * 20;
        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full transition-opacity duration-700"
            style={{
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              backgroundColor: i % 2 === 0 ? "hsl(140,40%,55%)" : "hsl(160,45%,50%)",
              opacity: visible ? 0.5 : 0,
              transitionDelay: `${0.8 + i * 0.1}s`,
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`,
            }}
          />
        );
      })}

      {/* Stacked layers */}
      {layers.map((layer, i) => (
        <div
          key={i}
          className={`absolute left-1/2 w-[220px] h-[56px] rounded-xl bg-gradient-to-r ${layer.gradient} shadow-lg transition-all duration-700 ease-out`}
          style={{
            transform: visible
              ? `translateX(-50%) translateY(${layer.yOff}px)`
              : `translateX(-50%) translateY(60px) scale(0.9)`,
            opacity: visible ? 1 : 0,
            transitionDelay: `${layer.delay}s`,
            bottom: "60px",
            boxShadow: visible ? `0 8px 24px -4px hsl(140,35%,35%,0.25)` : "none",
          }}
        >
          <div className="flex items-center h-full px-4 gap-3">
            <div className="flex-1 space-y-1.5">
              <div className="h-1.5 bg-white/25 rounded-full w-3/4" />
              <div className="h-1.5 bg-white/15 rounded-full w-1/2" />
            </div>
            <span className="text-[9px] text-white/70 font-medium tracking-wider uppercase whitespace-nowrap">
              {layer.label}
            </span>
          </div>
          {tick % 3 === i && visible && (
            <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-ping" style={{ animationDuration: "1.5s" }} />
          )}
        </div>
      ))}

      {/* Floating data badge */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-[hsl(140,25%,85%)] rounded-xl px-4 py-2 shadow-lg transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
          transitionDelay: "1s",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[hsl(140,50%,45%)] animate-pulse" />
          <span className="text-[10px] font-medium text-foreground">Contract Active</span>
          <span className="text-[10px] text-muted-foreground">$12,500</span>
        </div>
      </div>

      {/* Floating hash badge */}
      <div
        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-[hsl(140,25%,85%)] rounded-lg px-3 py-1.5 shadow-md transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.9)",
          transitionDelay: "1.2s",
        }}
      >
        <span className="text-[8px] font-mono text-muted-foreground">SHA-256: 0x3a1b…9c2d</span>
      </div>
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
          {/* Video area */}
          <div
            className="relative flex items-center justify-center py-8 md:py-12 transition-all duration-700 ease-out"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.4s",
            }}
          >
            <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden" style={{
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
                src="/videos/about-section.mp4"
              />
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
