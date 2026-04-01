import { ArrowUpRight, ChevronDown, Lock, Zap, FileText, Shield, Hash, Blocks, Coins, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const tabs = [
  {
    title: "Ricardian Hash Linking",
    icon: Hash,
    summary: "Binding legal prose to smart contracts with cryptographic certainty",
    details: [
      "Our system generates a clean, human-readable legal contract (PDF) and simultaneously creates a matching Base smart contract with the same terms encoded as code.",
      "A cryptographic hash permanently links the two together — creating a tamper-proof bond between the legal document and its on-chain counterpart.",
      "If anyone modifies the legal document after signing, the hash won't match — providing instant, verifiable proof of tampering.",
      "Both parties sign with a regular electronic signature (legally binding under ESIGN Act & UETA) and a wallet signature (blockchain binding)."
    ],
  },
  {
    title: "Base Blockchain Integration",
    icon: Blocks,
    summary: "Low-cost, high-speed settlement on Coinbase's L2 network",
    details: [
      "Built on Base — Coinbase's Ethereum L2 — offering sub-second finality and gas fees under $0.01 per transaction.",
      "Smart contracts handle escrow management: accepting stablecoin deposits, holding funds securely, and releasing payments when milestones are approved.",
      "Each contract encodes milestone logic on-chain — the smart contract knows the payment amount for each milestone and only releases funds when conditions are met.",
      "Timeout and deadline enforcement: if a company doesn't review a deliverable within the agreed timeframe, the contract can auto-release payment."
    ],
  },
  {
    title: "Stablecoin Orchestration",
    icon: Coins,
    summary: "USDC & PYUSD payment rails — digital dollars, zero volatility",
    details: [
      "Payments are made in USDC or PYUSD — stablecoins always worth $1 USD — so nobody deals with crypto price swings.",
      "Integration with Base Developer Platform APIs handles wallet creation, compliance checks, and stablecoin transactions.",
      "Support for fiat on-ramps: companies can fund escrow with traditional bank transfers that auto-convert to stablecoins.",
      "ERC-20 shielded transfers via zk-proofs provide payment privacy — amounts are hidden from the public blockchain while remaining verifiable by auditors."
    ],
  },
  {
    title: "Dispute Resolution Protocol",
    icon: Shield,
    summary: "On-chain arbitration with automatic payment pausing",
    details: [
      "Either party can trigger a dispute at any time. The smart contract instantly freezes the relevant milestone's funds until resolution.",
      "Both parties submit evidence through the platform. The dispute status and resolution timeline are transparently tracked.",
      "Resolution is governed by the human-readable legal contract — the Ricardian link ensures the legal prose controls when the code can't decide.",
      "Partnership with established arbitration bodies ensures enterprise-grade dispute handling with legally enforceable outcomes."
    ],
  },
];

const advantages = [
  {
    title: "Instant Settlement",
    description: "From 45 days to 14 seconds. Milestone approved → payment released. No invoices, no AP department, no delays.",
    num: "01",
    icon: Zap,
    animIcons: [Zap, Coins, Blocks],
  },
  {
    title: "Tamper-Proof Records",
    description: "Cryptographic hashing links every legal clause to its on-chain counterpart. Full audit trail stored permanently on Base.",
    num: "02",
    icon: Lock,
    animIcons: [Lock, Hash, Shield],
  },
  {
    title: "Enterprise Compliance",
    description: "KYC/AML verification, SOC 2 readiness, ESIGN Act & UETA compliance, GENIUS Act stablecoin framework adherence.",
    num: "03",
    icon: FileText,
    animIcons: [FileText, Search, Shield],
  },
];

const MorphingIcon = ({ icons }: { icons: typeof advantages[0]["animIcons"] }) => {
  const [idx, setIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIdx((p) => (p + 1) % icons.length);
        setIsTransitioning(false);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, [icons.length]);

  const Icon = icons[idx];
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div
        className="transition-all duration-300 ease-out"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "scale(0.5) rotate(90deg)" : "scale(1) rotate(0deg)",
        }}
      >
        <Icon size={40} strokeWidth={1} className="text-foreground/70" />
      </div>
    </div>
  );
};

const ScienceSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedTab, setExpandedTab] = useState<number | null>(0);
  const { ref, isInView } = useInViewAnimation();
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleTab = (i: number) => {
    setActiveTab(i);
    setExpandedTab(expandedTab === i ? null : i);
  };

  return (
    <section ref={ref} className="bg-background py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between mb-12 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-medium text-foreground leading-tight">
            The Technology Behind<br />Our Platform
          </h2>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <a href="#" className="text-xs font-medium text-muted-foreground border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors">
              View Documentation
            </a>
          </div>
        </div>

        <div className={`${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
          <div className="space-y-0 border-t border-border">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isExpanded = expandedTab === i;
              return (
                <div key={i} className="border-b border-border">
                  <button
                    onClick={() => toggleTab(i)}
                    className={`w-full text-left py-5 flex items-center justify-between transition-colors group ${
                      activeTab === i ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        activeTab === i ? "bg-foreground/10" : "bg-muted"
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-medium block">{tab.title}</span>
                        <span className="text-xs text-muted-foreground">{tab.summary}</span>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 text-muted-foreground ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    ref={(el) => { contentRefs.current[i] = el; }}
                    className="overflow-hidden transition-all duration-500 ease-out"
                    style={{
                      maxHeight: isExpanded ? `${contentRefs.current[i]?.scrollHeight || 500}px` : "0px",
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div className="pb-6 pl-11 pr-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tab.details.map((detail, j) => (
                          <div
                            key={j}
                            className="bg-muted rounded-xl p-4 text-sm text-muted-foreground leading-relaxed"
                            style={{
                              opacity: isExpanded ? 1 : 0,
                              transform: isExpanded ? "translateY(0)" : "translateY(10px)",
                              transition: `all 0.4s ease-out ${j * 0.1}s`,
                            }}
                          >
                            <span className="text-foreground font-medium text-xs mr-2">0{j + 1}</span>
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Advantages */}
        <div className="mt-20">
          <div
            className={`flex items-center justify-between mb-10 ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            <span className="text-xs text-muted-foreground">Enterprise-Grade Infrastructure</span>
            <h3 className="text-3xl md:text-4xl font-medium text-foreground">Our Advantages</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {advantages.map((a, i) => (
              <div
                key={a.num}
                className={`bg-muted rounded-2xl p-6 md:p-8 relative group hover:shadow-md transition-all duration-300 overflow-hidden ${isInView ? "animate-fade-in-up" : ""}`}
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="text-[10px] font-medium text-muted-foreground border border-border rounded-full px-3 py-1">
                    Advantage
                  </span>
                  <ArrowUpRight size={20} className="text-muted-foreground/30 group-hover:text-foreground/60 transition-colors" />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <MorphingIcon icons={a.animIcons} />
                  <div>
                    <h4 className="text-base font-medium text-foreground leading-snug">{a.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[200px]">{a.description}</p>
                  </div>
                </div>

                <p
                  className="text-[64px] md:text-[80px] font-light text-foreground/5 leading-none mt-4 tracking-tight absolute bottom-2 right-4"
                  style={{ fontFamily: "serif" }}
                >
                  {a.num}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceSection;
