import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Shield, FileText, Code, Link, Box } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Legal Prose",
    description: "Human-readable contract with signature fields, jurisdiction, and governing law.",
    detail: "Standard PDF agreement",
  },
  {
    icon: Code,
    title: "Smart Contract",
    description: "Solidity code defining escrow logic, milestone triggers, and auto-release rules.",
    detail: "Deployed on Base L2",
  },
  {
    icon: Link,
    title: "Cryptographic Link",
    description: "SHA-256 hash binds both documents. Any tampering breaks the chain.",
    detail: "Immutable binding",
  },
  {
    icon: Box,
    title: "Immutable Record",
    description: "Confirmed on Base blockchain. Permanent, auditable, transparent.",
    detail: "Block confirmation",
  },
];

const ScrambleText = ({ text, isActive }: { text: string; isActive: boolean }) => {
  const [displayed, setDisplayed] = useState("");
  const chars = "0123456789abcdef";

  useEffect(() => {
    if (!isActive) { setDisplayed(""); return; }
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayed(
        text.split("").map((char, i) => (i < iteration ? char : chars[Math.floor(Math.random() * chars.length)]))
          .join("")
      );
      iteration += 0.5;
      if (iteration > text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [isActive, text]);

  return <span className="font-mono text-xs md:text-sm text-primary-foreground/60 break-all">{displayed}</span>;
};

const RicardianMagic = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hashString = "a3f2b8c4d1e9f0a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4";

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-[hsl(var(--section-deep))] grid-pattern">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-6"
        >
          <span className="font-barlow font-medium text-sm tracking-widest uppercase text-primary-foreground/40">
            The Ricardian Magic
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-4"
        >
          <span className="font-barlow font-bold text-4xl md:text-5xl text-primary-foreground tracking-tight">
            Two Documents.{" "}
          </span>
          <span className="font-instrument italic text-4xl md:text-5xl text-primary-foreground">
            One Truth.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-center font-barlow text-primary-foreground/50 text-lg max-w-2xl mx-auto mb-16"
        >
          A Ricardian contract cryptographically binds a human-readable legal agreement 
          to machine-executable smart contract code. Change one, and the hash breaks.
        </motion.p>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={isInView ? { opacity: 1, rotateY: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.7, ease: "easeOut" }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 h-full hover:bg-primary-foreground/10 transition-all duration-500 hover:scale-105">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-4 group-hover:bg-primary-foreground/20 transition-colors">
                  <step.icon size={24} className="text-primary-foreground/70" />
                </div>
                <div className="font-barlow text-xs uppercase tracking-wider text-primary-foreground/30 mb-2">
                  {step.detail}
                </div>
                <h3 className="font-barlow font-bold text-xl text-primary-foreground mb-2">{step.title}</h3>
                <p className="font-barlow text-sm text-primary-foreground/50 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hash visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 glass-card rounded-full px-6 py-3">
            <Shield size={18} className="text-primary-foreground/60" />
            <ScrambleText text={hashString} isActive={isInView} />
          </div>
          <motion.div
            animate={isInView ? { scale: [1, 1.1, 1] } : {}}
            transition={{ delay: 2.5, duration: 1, repeat: Infinity, repeatDelay: 3 }}
            className="mt-4 inline-flex items-center gap-2 font-barlow text-sm text-primary-foreground/40"
          >
            <Shield size={14} /> Tamper-Proof
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RicardianMagic;
