import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Clock, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface MilestoneItem {
  weeks: string;
  title: string;
  tasks: string[];
}

interface Phase {
  id: number;
  label: string;
  title: string;
  color: string; // tailwind border color class
  accentHsl: string; // raw hsl for glow
  milestones: MilestoneItem[];
  future?: boolean;
}

const phases: Phase[] = [
  {
    id: 1,
    label: "Phase 1",
    title: "Foundation & MVP",
    color: "border-l-blue-500",
    accentHsl: "217 91% 60%",
    milestones: [
      { weeks: "1–2", title: "Setup", tasks: ["Team onboarding, repo setup, CI/CD pipelines", "Base Sepolia testnet access", "Design system finalization"] },
      { weeks: "3–4", title: "Backend Core", tasks: ["User auth (JWT + OAuth)", "Database schema (PostgreSQL)", "Basic API structure"] },
      { weeks: "5–6", title: "Smart Contracts v1", tasks: ["Basic escrow contract (Solidity)", "Deposit/withdrawal logic", "Base testnet deployment"] },
      { weeks: "7–8", title: "Frontend Foundation", tasks: ["React/Next.js setup", "Wallet connection (wagmi + RainbowKit)", "Landing page + Dashboard shell"] },
      { weeks: "9–10", title: "Contract Builder", tasks: ["Template system", "Form wizard (5 steps)", "PDF generation + hash computation"] },
      { weeks: "11–12", title: "Milestone Flow", tasks: ["Submit/approve/reject logic", "Auto-payment on approval", "Notification system"] },
      { weeks: "13–14", title: "Integration", tasks: ["Base Developer Platform (USDC/PYUSD)", "Document storage (Arweave/IPFS)", "Ricardian linking (hash on-chain)"] },
      { weeks: "15–16", title: "Internal Testing", tasks: ["End-to-end testnet flows", "Bug fixes", "Security review prep"] },
    ],
  },
  {
    id: 2,
    label: "Phase 2",
    title: "Security & Pilot",
    color: "border-l-emerald-500",
    accentHsl: "160 84% 39%",
    milestones: [
      { weeks: "17–18", title: "KYC Integration", tasks: ["Provider integration (Chainalysis/Jumio)", "Identity verification flow", "Compliance logging"] },
      { weeks: "19–20", title: "Privacy Features", tasks: ["ERC-20 shielded transfers research", "zk-proof implementation", "Confidential balances option"] },
      { weeks: "21–22", title: "Dispute System", tasks: ["Raise dispute flow", "Pause payment logic", "Evidence submission"] },
      { weeks: "23–24", title: "Security Audit", tasks: ["OpenZeppelin / Trail of Bits engagement", "Fix critical issues", "Re-audit if needed"] },
      { weeks: "25–26", title: "Beta Prep", tasks: ["Mainnet deployment scripts", "Monitoring setup", "Beta user onboarding"] },
      { weeks: "27–28", title: "Closed Beta", tasks: ["3–5 Web3-native companies", "Real contracts, real stablecoins", "Daily feedback collection"] },
      { weeks: "29–30", title: "Iteration", tasks: ["UI/UX improvements from feedback", "Performance optimization", "Bug fixes"] },
      { weeks: "31–32", title: "Production Launch", tasks: ["Base mainnet live", "Public access", "Marketing site launch"] },
    ],
  },
  {
    id: 3,
    label: "Phase 3",
    title: "Enterprise",
    color: "border-l-gray-400",
    accentHsl: "0 0% 64%",
    future: true,
    milestones: [
      { weeks: "Months 9–14", title: "Enterprise Scale", tasks: ["SOC 2 Type II certification", "SAP / Workday integrations", "Fortune 500 sales"] },
    ],
  },
  {
    id: 4,
    label: "Phase 4",
    title: "Scale",
    color: "border-l-gray-300",
    accentHsl: "0 0% 76%",
    future: true,
    milestones: [
      { weeks: "Month 15+", title: "Global Expansion", tasks: ["Multi-vertical expansion", "AI-assisted drafting", "International stablecoins"] },
    ],
  },
];

// "We are here" marker at Phase 1
const CURRENT_PHASE = 1;
const CURRENT_WEEK = 2;

const RoadmapSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const phaseHeadersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the SVG path drawing
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set(glowRef.current, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to([pathRef.current, glowRef.current], {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      }

      // Animate phase headers
      phaseHeadersRef.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      });

      // Animate each milestone node
      nodesRef.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Build a flat list of nodes for ref indexing
  let nodeIndex = 0;
  let phaseIndex = 0;

  // Calculate total nodes for SVG path height
  const totalNodes = phases.reduce((sum, p) => sum + p.milestones.length, 0) + phases.length;

  return (
    <section ref={sectionRef} className="bg-background py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
            Development Roadmap
          </span>
          <h2 className="text-4xl md:text-5xl font-medium text-foreground leading-tight">
            Implementation{" "}
            <span className="font-instrument italic text-muted-foreground">Timeline</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From concept to mainnet in 32 weeks
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* SVG illuminating path */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px pointer-events-none" style={{ zIndex: 0 }}>
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2"
              width="4"
              height="100%"
              style={{ overflow: "visible" }}
            >
              {/* Background track */}
              <line x1="2" y1="0" x2="2" y2="100%" stroke="hsl(var(--border))" strokeWidth="2" />
              {/* Glow layer */}
              <line
                ref={glowRef as any}
                x1="2" y1="0" x2="2" y2="100%"
                stroke="hsl(217 91% 60% / 0.3)"
                strokeWidth="8"
                strokeLinecap="round"
                style={{ filter: "blur(6px)" }}
              />
              {/* Main illuminating line */}
              <line
                ref={pathRef as any}
                x1="2" y1="0" x2="2" y2="100%"
                stroke="hsl(217 91% 60%)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Phases & milestones */}
          <div className="relative" style={{ zIndex: 1 }}>
            {phases.map((phase) => {
              const currentPhaseIndex = phaseIndex++;
              const isCurrentPhase = phase.id === CURRENT_PHASE;

              return (
                <div key={phase.id} className="mb-12 last:mb-0">
                  {/* Phase header */}
                  <div
                    ref={(el) => { phaseHeadersRef.current[currentPhaseIndex] = el; }}
                    className="flex items-center gap-4 mb-6 pl-16 md:pl-20"
                  >
                    {/* Node dot on the line */}
                    <div
                      className="absolute left-6 md:left-8 w-4 h-4 -translate-x-1/2 rounded-full border-2 border-foreground bg-background"
                      style={{ boxShadow: isCurrentPhase ? `0 0 12px hsl(${phase.accentHsl} / 0.5)` : "none" }}
                    />
                    <div>
                      <span className={`text-[10px] font-semibold tracking-widest uppercase ${phase.future ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
                        {phase.label}
                      </span>
                      <h3 className={`text-xl md:text-2xl font-medium ${phase.future ? "text-muted-foreground" : "text-foreground"}`}>
                        {phase.title}
                        {isCurrentPhase && (
                          <span className="ml-3 inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                            <Clock className="w-3 h-3" /> We are here
                          </span>
                        )}
                      </h3>
                      {!phase.future && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {phase.id === 1 ? "Weeks 1–16" : "Weeks 17–32"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Milestone cards */}
                  <div className="space-y-4 pl-16 md:pl-20">
                    {phase.milestones.map((milestone) => {
                      const currentNodeIndex = nodeIndex++;
                      const isCompleted = phase.id < CURRENT_PHASE ||
                        (phase.id === CURRENT_PHASE && parseInt(milestone.weeks) < CURRENT_WEEK);
                      const isCurrent = phase.id === CURRENT_PHASE &&
                        milestone.weeks.includes(String(CURRENT_WEEK));

                      return (
                        <div
                          key={milestone.title}
                          ref={(el) => { nodesRef.current[currentNodeIndex] = el; }}
                          className="relative group"
                        >
                          {/* Dot on timeline */}
                          <div
                            className={`absolute -left-10 md:-left-12 top-5 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              isCompleted
                                ? "bg-emerald-500"
                                : isCurrent
                                ? "bg-blue-500 ring-4 ring-blue-500/20"
                                : phase.future
                                ? "bg-muted-foreground/30"
                                : "bg-border"
                            }`}
                          />

                          {/* Card */}
                          <div
                            className={`border rounded-xl p-5 transition-all duration-300 group-hover:shadow-md ${
                              phase.future
                                ? "bg-muted/30 border-border/50"
                                : isCurrent
                                ? "bg-card border-blue-200 shadow-sm"
                                : "bg-card border-border hover:border-border"
                            } ${phase.color} border-l-[3px]`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                                    phase.future
                                      ? "bg-muted text-muted-foreground"
                                      : isCompleted
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-secondary text-secondary-foreground"
                                  }`}>
                                    {milestone.weeks.startsWith("Month") ? milestone.weeks : `Week ${milestone.weeks}`}
                                  </span>
                                  {isCompleted && <Check className="w-4 h-4 text-emerald-500" />}
                                </div>
                                <h4 className={`text-base font-medium ${phase.future ? "text-muted-foreground" : "text-foreground"}`}>
                                  {milestone.title}
                                </h4>
                              </div>
                            </div>

                            <ul className="mt-3 space-y-1.5">
                              {milestone.tasks.map((task) => (
                                <li key={task} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40 flex-shrink-0" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Timelines subject to adjustment based on audit findings and beta feedback.{" "}
            <a href="mailto:hello@ricardianbase.com" className="underline hover:text-foreground transition-colors">
              Contact us
            </a>{" "}
            for questions about our roadmap.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
