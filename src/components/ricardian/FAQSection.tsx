import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "What is a Ricardian contract?",
    a: "A Ricardian contract is a hybrid instrument that cryptographically links a human-readable legal agreement (PDF) to a machine-executable smart contract on the blockchain. This creates a tamper-proof bond between legal prose and programmatic logic.",
    category: "Platform",
  },
  {
    q: "Which blockchain does Ricardian use?",
    a: "Ricardian is built on Base, Coinbase's Ethereum Layer 2 network. Base offers sub-second finality, gas fees under $0.01, and enterprise-grade reliability.",
    category: "Technology",
  },
  {
    q: "What stablecoins are supported?",
    a: "We currently support USDC for all escrow and milestone payments. These are fully-backed, regulated stablecoins that provide price stability for enterprise transactions.",
    category: "Payments",
  },
  {
    q: "How does the escrow system work?",
    a: "When a contract is created, the client deposits funds into a smart contract escrow. Funds are locked and visible to both parties. As milestones are approved, payments release instantly — no invoices needed.",
    category: "Payments",
  },
  {
    q: "Is KYC/AML verification required?",
    a: "Yes. All users undergo identity verification through our integrated KYC/AML providers. This ensures regulatory compliance and builds trust between contracting parties.",
    category: "Compliance",
  },
  {
    q: "What happens if there's a dispute?",
    a: "Either party can trigger a dispute at any milestone. The smart contract instantly freezes the relevant funds. Both parties submit evidence, and resolution follows the terms defined in the contract's legal prose.",
    category: "Platform",
  },
  {
    q: "Can I integrate with enterprise tools?",
    a: "Enterprise integrations with SAP, Workday, and other procurement platforms are on our Phase 3 roadmap. Contact us for early access to our API.",
    category: "Enterprise",
  },
  {
    q: "How is my data secured?",
    a: "Contract documents are stored on decentralized infrastructure (Arweave/IPFS). All on-chain data is immutable and verifiable. We're pursuing SOC 2 Type II certification as part of our enterprise roadmap.",
    category: "Security",
  },
];

const FAQSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: headerRef.current, start: "top 85%" },
          }
        );
      }

      // Staggered FAQ items
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
            delay: i * 0.06,
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleItem = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // Split FAQs into two columns
  const mid = Math.ceil(faqs.length / 2);
  const leftCol = faqs.slice(0, mid);
  const rightCol = faqs.slice(mid);

  const renderItem = (faq: typeof faqs[0], i: number, globalIndex: number) => {
    const isOpen = openIndex === globalIndex;

    return (
      <div
        key={globalIndex}
        ref={(el) => { itemRefs.current[globalIndex] = el; }}
        className={`group border border-border rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen
            ? "bg-card shadow-[0_4px_24px_hsl(0_0%_0%/0.06)] border-[hsl(140,38%,38%)]/20"
            : "bg-background hover:bg-secondary/20 hover:border-border/80"
        }`}
      >
        <button
          onClick={() => toggleItem(globalIndex)}
          className="w-full flex items-start gap-3 p-5 text-left transition-colors"
        >
          {/* Number badge */}
          <span
            className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all duration-300 ${
              isOpen
                ? "bg-[hsl(140,38%,38%)] text-white"
                : "bg-secondary text-muted-foreground group-hover:bg-secondary/80"
            }`}
          >
            {String(globalIndex + 1).padStart(2, "0")}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground/60">
                {faq.category}
              </span>
            </div>
            <span className="text-sm font-medium text-foreground leading-snug">{faq.q}</span>
          </div>

          <ChevronDown
            className={`w-4 h-4 mt-1 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-[hsl(140,38%,38%)]" : ""
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 pb-5 pl-[3.25rem]">
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="faq" ref={sectionRef} className="bg-background py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Support
            </span>
            <h2 className="text-4xl md:text-5xl font-medium text-foreground leading-tight">
              Frequently Asked{" "}
              <span className="font-instrument italic text-[hsl(140,38%,38%)]">Questions</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-lg">
              Everything you need to know about the Ricardian platform
            </p>
          </div>

          <a
            href="mailto:hello@ricardian.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-full px-5 py-2.5 transition-colors self-start lg:self-auto"
          >
            <MessageCircle size={16} />
            Still have questions? Contact us
          </a>
        </div>

        {/* Two-column FAQ grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="space-y-3">
            {leftCol.map((faq, i) => renderItem(faq, i, i))}
          </div>
          <div className="space-y-3">
            {rightCol.map((faq, i) => renderItem(faq, i, i + mid))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
