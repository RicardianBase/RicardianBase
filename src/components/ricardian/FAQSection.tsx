import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What is a Ricardian contract?",
    a: "A Ricardian contract is a hybrid instrument that cryptographically links a human-readable legal agreement (PDF) to a machine-executable smart contract on the blockchain. This creates a tamper-proof bond between legal prose and programmatic logic.",
  },
  {
    q: "Which blockchain does RicardianBase use?",
    a: "RicardianBase is built on Base, Coinbase's Ethereum Layer 2 network. Base offers sub-second finality, gas fees under $0.01, and enterprise-grade reliability.",
  },
  {
    q: "What stablecoins are supported for payments?",
    a: "We currently support USDC and PYUSD for all escrow and milestone payments. These are fully-backed, regulated stablecoins that provide price stability for enterprise transactions.",
  },
  {
    q: "How does the escrow system work?",
    a: "When a contract is created, the client deposits funds into a smart contract escrow. Funds are locked and visible to both parties. As milestones are approved, payments release instantly — no invoices, no accounts payable department needed.",
  },
  {
    q: "Is KYC/AML verification required?",
    a: "Yes. All users undergo identity verification through our integrated KYC/AML providers. This ensures regulatory compliance and builds trust between contracting parties.",
  },
  {
    q: "What happens if there's a dispute?",
    a: "Either party can trigger a dispute at any milestone. The smart contract instantly freezes the relevant funds. Both parties submit evidence through the platform, and resolution follows the terms defined in the Ricardian contract's legal prose.",
  },
  {
    q: "Can I integrate RicardianBase with existing enterprise tools?",
    a: "Enterprise integrations with SAP, Workday, and other procurement platforms are on our Phase 3 roadmap. Contact us for early access to our API.",
  },
  {
    q: "How is my data secured?",
    a: "Contract documents are stored on decentralized infrastructure (Arweave/IPFS). All on-chain data is immutable and verifiable. We're pursuing SOC 2 Type II certification as part of our enterprise roadmap.",
  },
];

const FAQSection = () => {
  const { ref, isInView } = useInViewAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="bg-background py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
            Support
          </span>
          <h2 className={`text-4xl md:text-5xl font-medium text-foreground leading-tight ${isInView ? "animate-fade-in-up" : ""}`}>
            Frequently Asked{" "}
            <span className="font-instrument italic text-emerald-500">Questions</span>
          </h2>
          <p className={`mt-4 text-muted-foreground text-lg ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
            Everything you need to know about RicardianBase
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border border-border rounded-2xl overflow-hidden transition-all duration-300 ${isInView ? "animate-fade-in-up" : ""} ${isOpen ? "shadow-sm" : ""}`}
                style={{ animationDelay: `${0.15 + i * 0.04}s` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-sm md:text-base font-medium text-foreground pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
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

export default FAQSection;
