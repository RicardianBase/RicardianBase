import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Clock, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Phase {
  id: number;
  label: string;
  title: string;
  weeks: string;
  accentClass: string;
  dotClass: string;
  items: { week: string; title: string; tasks: string[] }[];
  future?: boolean;
}

const phases: Phase[] = [
  {
    id: 1, label: "Phase 1", title: "Foundation & MVP", weeks: "Weeks 1–16",
    accentClass: "border-blue-500", dotClass: "bg-blue-500",
    items: [
      { week: "1–2", title: "Setup", tasks: ["Team onboarding, CI/CD", "Base Sepolia testnet", "Design system"] },
      { week: "3–4", title: "Backend Core", tasks: ["Auth (JWT + OAuth)", "PostgreSQL schema", "API structure"] },
      { week: "5–6", title: "Smart Contracts v1", tasks: ["Escrow contract", "Deposit/withdrawal", "Testnet deploy"] },
      { week: "7–8", title: "Frontend", tasks: ["React setup", "Wallet connection", "Dashboard shell"] },
      { week: "9–10", title: "Contract Builder", tasks: ["Templates", "Form wizard", "PDF + hash"] },
      { week: "11–12", title: "Milestone Flow", tasks: ["Approve/reject", "Auto-payment", "Notifications"] },
      { week: "13–14", title: "Integration", tasks: ["USDC/PYUSD", "Arweave/IPFS", "On-chain linking"] },
      { week: "15–16", title: "Testing", tasks: ["E2E testnet flows", "Bug fixes", "Security prep"] },
    ],
  },
  {
    id: 2, label: "Phase 2", title: "Security & Pilot", weeks: "Weeks 17–32",
    accentClass: "border-emerald-500", dotClass: "bg-emerald-500",
    items: [
      { week: "17–18", title: "KYC", tasks: ["Chainalysis/Jumio", "ID verification", "Compliance logs"] },
      { week: "19–20", title: "Privacy", tasks: ["Shielded transfers", "zk-proofs", "Confidential balances"] },
      { week: "21–22", title: "Disputes", tasks: ["Dispute flow", "Pause payments", "Evidence submission"] },
      { week: "23–24", title: "Audit", tasks: ["OZ / Trail of Bits", "Fix criticals", "Re-audit"] },
      { week: "25–26", title: "Beta Prep", tasks: ["Mainnet scripts", "Monitoring", "User onboarding"] },
      { week: "27–28", title: "Closed Beta", tasks: ["3–5 companies", "Real stablecoins", "Daily feedback"] },
      { week: "29–30", title: "Iteration", tasks: ["UX improvements", "Performance", "Bug fixes"] },
      { week: "31–32", title: "Launch", tasks: ["Base mainnet", "Public access", "Marketing site"] },
    ],
  },
  {
    id: 3, label: "Phase 3", title: "Enterprise", weeks: "Months 9–14",
    accentClass: "border-border", dotClass: "bg-muted-foreground/40", future: true,
    items: [
      { week: "M9–14", title: "Enterprise Scale", tasks: ["SOC 2 Type II", "SAP/Workday", "Fortune 500"] },
    ],
  },
  {
    id: 4, label: "Phase 4", title: "Scale", weeks: "Month 15+",
    accentClass: "border-border", dotClass: "bg-muted-foreground/30", future: true,
    items: [
      { week: "15+", title: "Global Expansion", tasks: ["Multi-vertical", "AI drafting", "Intl stablecoins"] },
    ],
  },
];

const CURRENT_PHASE = 1;

const RoadmapSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [expanded, setExpanded] = useState<number | null>(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      phaseRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Compact phase cards */}
        <div className="space-y-4">
          {phases.map((phase, pi) => {
            const isOpen = expanded === phase.id;
            const isCurrent = phase.id === CURRENT_PHASE;

            return (
              <div
                key={phase.id}
                ref={(el) => { phaseRefs.current[pi] = el; }}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isCurrent ? "border-blue-200 shadow-sm" : "border-border"
                } ${phase.future ? "opacity-70" : ""}`}
              >
                {/* Phase header — clickable */}
                <button
                  onClick={() => setExpanded(isOpen ? null : phase.id)}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-secondary/30 transition-colors"
                >
                  {/* Accent dot */}
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${phase.dotClass}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                        {phase.label}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          <Clock className="w-2.5 h-2.5" /> Current
                        </span>
                      )}
                    </div>
                    <h3 className={`text-lg font-medium mt-0.5 ${phase.future ? "text-muted-foreground" : "text-foreground"}`}>
                      {phase.title}
                    </h3>
                  </div>

                  <span className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">{phase.weeks}</span>

                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expandable content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className={`border-t border-border px-5 md:px-6 py-5 ${isOpen ? "" : "pointer-events-none"}`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {phase.items.map((item) => {
                          const weekNum = parseInt(item.week);
                          const isCompleted = phase.id < CURRENT_PHASE;
                          
                          return (
                            <div
                              key={item.title}
                              className={`rounded-xl p-3.5 border transition-all duration-200 hover:shadow-sm ${
                                phase.future
                                  ? "bg-muted/20 border-border/50"
                                  : isCompleted
                                  ? "bg-emerald-50/50 border-emerald-100"
                                  : "bg-secondary/30 border-border"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  phase.future
                                    ? "bg-muted text-muted-foreground"
                                    : isCompleted
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-secondary text-secondary-foreground"
                                }`}>
                                  W{item.week}
                                </span>
                                {isCompleted && <Check className="w-3 h-3 text-emerald-500" />}
                              </div>
                              <h4 className={`text-sm font-medium mb-1.5 ${phase.future ? "text-muted-foreground" : "text-foreground"}`}>
                                {item.title}
                              </h4>
                              <ul className="space-y-0.5">
                                {item.tasks.map((t) => (
                                  <li key={t} className="text-[11px] text-muted-foreground leading-tight flex items-start gap-1.5">
                                    <span className="mt-1 w-1 h-1 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Timelines subject to adjustment based on audit findings and beta feedback.{" "}
            <a href="mailto:hello@ricardianbase.com" className="underline hover:text-foreground transition-colors">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
