import { useRef, useEffect, useState } from "react";
import { Shield, FileText, Zap, Lock, Layers } from "lucide-react";

const labels = [
  { text: "SMART ESCROW", side: "left" as const },
  { text: "RICARDIAN CONTRACTS", side: "left" as const },
  { text: "AUTO-EXECUTION", side: "left" as const },
  { text: "KYC/AML", side: "left" as const },
  { text: "BASE L2", side: "left" as const },
];

const rightLabels = [
  "ENTERPRISE TEMPLATES",
  "STABLECOIN PAYMENTS",
  "BUILT ON BASE",
];

const features = [
  {
    icon: Shield,
    title: "Smart Escrow",
    desc: "Milestone-based escrow with USDC & PYUSD stablecoins.",
  },
  {
    icon: FileText,
    title: "Ricardian Contracts",
    desc: "Cryptographic hash linking legal prose to smart contracts.",
  },
  {
    icon: Zap,
    title: "Auto-Execution",
    desc: "Approve milestones and trigger instant on-chain settlement.",
  },
  {
    icon: Layers,
    title: "Compliance",
    desc: "Enterprise-grade KYC/AML verification built in.",
  },
  {
    icon: Lock,
    title: "Base L2",
    desc: "Reliable and performant blockchain infrastructure.",
  },
];

/* Animated isometric stack illustration */
const IsometricStack = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const layers = [
    { y: 0, label: "Smart Contract Layer", delay: "0.6s" },
    { y: -28, label: "Ricardian Link Layer", delay: "0.4s" },
    { y: -56, label: "Payment Layer", delay: "0.2s" },
  ];

  return (
    <div ref={ref} className="relative w-[280px] h-[240px] mx-auto">
      {layers.map((layer, i) => (
        <div
          key={i}
          className="absolute left-1/2 w-[220px] h-[72px] rounded-xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-700 ease-out"
          style={{
            transform: visible
              ? `translateX(-50%) translateY(${layer.y}px)`
              : `translateX(-50%) translateY(40px)`,
            opacity: visible ? 1 : 0,
            transitionDelay: layer.delay,
            bottom: "40px",
          }}
        >
          <div className="flex items-center justify-center h-full gap-2">
            <div className="w-[60%] space-y-1.5 px-4">
              <div className="h-1.5 bg-border rounded-full w-3/4" />
              <div className="h-1.5 bg-border rounded-full w-1/2" />
              <div className="h-1.5 bg-border rounded-full w-2/3" />
            </div>
            <span className="text-[9px] text-muted-foreground font-medium tracking-wider uppercase pr-3">
              {layer.label}
            </span>
          </div>
        </div>
      ))}
      {/* Price tag floating */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
          transitionDelay: "0.8s",
        }}
      >
        $179.99
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
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-muted/30 py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main card */}
        <div
          className="bg-card border border-border rounded-3xl p-10 md:p-16 transition-all duration-700 ease-out"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
          }}
        >
          {/* Header area */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase flex items-center gap-2 mb-4">
                <span className="text-sm">✦</span> What is RicardianBase?
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-[42px] font-normal text-foreground leading-[1.15]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                A contract platform with built-in
                escrow and on-chain execution
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed lg:pt-10">
              Add enterprise contract workflows with smart escrow, Ricardian linking, auto-execution, and compliance endpoints.
            </p>
          </div>

          {/* Illustration area */}
          <div className="relative flex items-center justify-center py-12 md:py-16">
            {/* Left labels */}
            <div className="hidden md:flex flex-col gap-3 absolute left-0 top-1/2 -translate-y-1/2">
              {labels.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 transition-all duration-500 ease-out"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(-20px)",
                    transitionDelay: `${0.3 + i * 0.1}s`,
                  }}
                >
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wider">
                    {l.text}
                  </span>
                  <div className="w-8 h-px bg-border" />
                </div>
              ))}
            </div>

            {/* Center illustration */}
            <IsometricStack />

            {/* Right labels */}
            <div className="hidden md:flex flex-col gap-4 absolute right-0 top-1/2 -translate-y-1/2">
              {rightLabels.map((l, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 transition-all duration-500 ease-out"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateX(0)" : "translateX(20px)",
                    transitionDelay: `${0.5 + i * 0.1}s`,
                  }}
                >
                  <div className="w-8 h-px bg-border" />
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wider">
                    {l}
                  </span>
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
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-foreground">
                <f.icon size={14} strokeWidth={1.5} />
                <span className="text-sm font-medium">{f.title}</span>
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
