import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Building2, Code2, DollarSign, Shield, Globe, Clock, Zap, Lock } from "lucide-react";

const companyBenefits = [
  { icon: Shield, title: "Guaranteed Delivery", description: "Milestone-based escrow ensures work is completed before payment releases." },
  { icon: Globe, title: "Hire Globally", description: "Pay contractors in any country with stablecoin — no wire fees, no delays." },
  { icon: Lock, title: "Legal Protection", description: "Ricardian contracts are legally binding in 190+ jurisdictions." },
  { icon: Building2, title: "Enterprise Ready", description: "SOC 2 compliant, API access, dedicated success manager for large teams." },
];

const contractorBenefits = [
  { icon: Zap, title: "Instant Payments", description: "Get paid in seconds, not months. Funds release automatically on approval." },
  { icon: DollarSign, title: "Stable Value", description: "Receive USDC or PYUSD — no crypto volatility, full purchasing power." },
  { icon: Shield, title: "Guaranteed Escrow", description: "Funds are locked before you start. No more chasing invoices." },
  { icon: Clock, title: "Auto-Approval", description: "If the client doesn't respond, milestones auto-approve after the deadline." },
];

const ForWhom = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<"companies" | "contractors">("companies");

  const benefits = activeTab === "companies" ? companyBenefits : contractorBenefits;

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-[hsl(var(--section-dark))] noise-texture">
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <span className="font-barlow font-medium text-sm tracking-widest uppercase text-primary-foreground/40">
            Built For Modern Teams
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-16"
        >
          <span className="font-barlow font-bold text-4xl md:text-5xl text-primary-foreground tracking-tight">
            Whether you hire{" "}
          </span>
          <span className="font-instrument italic text-4xl md:text-5xl text-primary-foreground">
            or get hired
          </span>
        </motion.h2>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex glass-card rounded-full p-1">
            {(["companies", "contractors"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative font-barlow font-medium text-sm px-8 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-primary-foreground text-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground"
                }`}
              >
                {tab === "companies" ? "For Companies" : "For Contractors"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Benefits grid with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 hover:bg-primary-foreground/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center mb-4">
                  <benefit.icon size={20} className="text-primary-foreground/70" />
                </div>
                <h3 className="font-barlow font-bold text-lg text-primary-foreground mb-2">{benefit.title}</h3>
                <p className="font-barlow text-sm text-primary-foreground/50 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Floating testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block glass-card rounded-2xl px-8 py-6 max-w-lg">
            <p className="font-instrument italic text-xl text-primary-foreground/80 mb-3">
              "I got paid in 14 seconds instead of 45 days."
            </p>
            <span className="font-barlow text-sm text-primary-foreground/40">
              — Senior Developer, Web3 Contractor
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ForWhom;
