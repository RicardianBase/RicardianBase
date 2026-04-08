import { useState, useEffect } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { Blocks, Coins, FileText, Hash, Lock, Shield, Zap, Server, Globe, ArrowUpRight } from "lucide-react";

const techStack = [
  {
    icon: Blocks,
    name: "Base Blockchain",
    category: "Settlement Layer",
    description: "Coinbase's Ethereum L2 network — sub-second finality, gas fees under $0.01. Smart contracts handle escrow, milestone logic, and Ricardian linking on-chain.",
    details: ["Hardhat & Foundry frameworks", "Solidity smart contracts", "Base Sepolia testnet → mainnet"],
    color: "hsl(217, 91%, 60%)",
  },
  {
    icon: Hash,
    name: "Ricardian Hash Engine",
    category: "Cryptographic Core",
    description: "Generates cryptographic hashes that permanently bind human-readable legal contracts to their on-chain smart contract counterparts. Any tampering is instantly detectable.",
    details: ["SHA-256 document hashing", "Dual-signature verification", "Tamper-proof audit trail"],
    color: "hsl(262, 83%, 58%)",
  },
  {
    icon: Coins,
    name: "USDC Payment Rails",
    category: "Payment Infrastructure",
    description: "Stablecoin payment orchestration — always $1 USD, zero volatility. Integrated with Base Developer Platform APIs for wallet creation, compliance, and transactions.",
    details: ["Fiat on-ramp support", "ERC-20 shielded transfers", "Confidential balances via zk-proofs"],
    color: "hsl(142, 71%, 45%)",
  },
  {
    icon: Shield,
    name: "KYC/AML Compliance",
    category: "Identity & Security",
    description: "Every user verifies identity before creating contracts or moving funds. SOC 2 Type II-ready architecture with role-based access controls and encrypted data.",
    details: ["Third-party identity provider", "GENIUS Act compliance", "ESIGN & UETA validated"],
    color: "hsl(38, 92%, 50%)",
  },
  {
    icon: FileText,
    name: "Smart Contract Templates",
    category: "Contract Engine",
    description: "Pre-built templates for common scenarios — 'Software Development Milestone-Based', 'Consulting Retainer', 'Creative Deliverables'. Real-time preview of generated legal documents.",
    details: ["Step-by-step contract builder", "Custom clause support", "PDF generation engine"],
    color: "hsl(346, 77%, 50%)",
  },
  {
    icon: Server,
    name: "Backend Infrastructure",
    category: "API & Data Layer",
    description: "RESTful API connecting frontend to blockchain. PostgreSQL for structured data, Redis for real-time features. Future-facing APIs for ERP integrations (SAP, Workday).",
    details: ["Node.js / NestJS", "ethers.js / viem integration", "Arweave / IPFS document storage"],
    color: "hsl(200, 70%, 50%)",
  },
];

const AnimatedOrbit = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const frame = () => {
      setRotation((r) => r + 0.15);
      id = requestAnimationFrame(frame);
    };
    let id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, []);

  const orbitIcons = [Blocks, Hash, Coins, Shield, Lock, Zap, Globe, FileText];
  const radius = 140;

  return (
    <div className="relative w-[320px] h-[320px] mx-auto">
      {/* Orbit rings */}
      <div className="absolute inset-0 rounded-full border border-border/40" />
      <div className="absolute inset-[20%] rounded-full border border-border/30" />
      <div className="absolute inset-[40%] rounded-full border border-border/20" />

      {/* Orbiting icons */}
      {orbitIcons.map((Icon, i) => {
        const angle = (rotation + i * (360 / orbitIcons.length)) * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <div
            key={i}
            className="absolute w-8 h-8 rounded-full bg-muted flex items-center justify-center shadow-sm border border-border/30"
            style={{
              left: `calc(50% + ${x}px - 16px)`,
              top: `calc(50% + ${y}px - 16px)`,
              transition: "none",
            }}
          >
            <Icon size={14} className="text-muted-foreground" />
          </div>
        );
      })}

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl font-medium text-foreground">6</p>
          <p className="text-xs text-muted-foreground">Core Modules</p>
        </div>
      </div>
    </div>
  );
};

const OrbitalTestimonials = () => {
  const { ref, isInView } = useInViewAnimation();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section ref={ref} className="bg-background py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: Animated orbit */}
          <div className={`flex-shrink-0 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            <AnimatedOrbit />
          </div>

          {/* Right: Heading + description */}
          <div className={`${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
            <span className="text-[10px] font-medium text-muted-foreground border border-border rounded-full px-3 py-1">
              Our Tech Stack
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-medium text-foreground leading-tight">
              Built for Enterprise Contract Execution
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-lg">
              A web platform that lets companies hire tech contractors using contracts that are both legally binding
              documents and automatically executing payment programs on the Base blockchain.
            </p>
          </div>
        </div>

        {/* Tech stack grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, i) => {
            const Icon = tech.icon;
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={tech.name}
                className={`bg-card border border-border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${isInView ? "animate-fade-in-up" : ""}`}
                style={{
                  animationDelay: `${0.3 + i * 0.08}s`,
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 12px 40px -12px hsla(0, 0%, 0%, 0.12)" : "none",
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tech.color}15` }}
                  >
                    <Icon size={20} style={{ color: tech.color }} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground/30 transition-all duration-300"
                    style={{
                      opacity: isHovered ? 1 : 0.3,
                      transform: isHovered ? "translate(2px, -2px)" : "translate(0, 0)",
                    }}
                  />
                </div>

                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {tech.category}
                </span>
                <h3 className="text-base font-medium text-foreground mt-1">{tech.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{tech.description}</p>

                {/* Expandable details */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-out"
                  style={{
                    maxHeight: isHovered ? "120px" : "0px",
                    opacity: isHovered ? 1 : 0,
                    marginTop: isHovered ? "12px" : "0px",
                  }}
                >
                  <div className="border-t border-border pt-3 space-y-1.5">
                    {tech.details.map((d, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                        <span className="text-[11px] text-muted-foreground">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OrbitalTestimonials;
