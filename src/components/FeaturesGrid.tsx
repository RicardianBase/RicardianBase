import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lock, Flag, PenTool, Scale, ShieldCheck, List } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Smart Escrow",
    description: "Funds locked in non-custodial escrow. Released automatically when milestones are approved.",
    span: "md:col-span-2",
  },
  {
    icon: Flag,
    title: "Milestone Tracking",
    description: "Define deliverables, set deadlines, track progress. Auto-approve if clients go silent.",
    span: "",
  },
  {
    icon: PenTool,
    title: "Dual Signatures",
    description: "E-signature for legal validity + wallet signature for blockchain execution. Both required.",
    span: "",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description: "Built-in mediation and multi-sig arbitration. Evidence submission, communication threads, fair outcomes.",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Shield",
    description: "Selective disclosure with zero-knowledge proofs. Share only what's needed, prove what matters.",
    span: "",
  },
  {
    icon: List,
    title: "Audit Trail",
    description: "Every action recorded on-chain. Immutable, transparent, exportable transaction history.",
    span: "",
  },
];

const FeaturesGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <span className="font-barlow font-medium text-sm tracking-widest uppercase text-foreground/40">
            Features
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-20"
        >
          <span className="font-barlow font-bold text-4xl md:text-5xl text-foreground tracking-tight">
            Everything{" "}
          </span>
          <span className="font-instrument italic text-4xl md:text-5xl text-foreground">
            You Need
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className={`group rounded-2xl border border-border p-8 hover:shadow-[0_16px_48px_hsl(var(--foreground)/0.08)] transition-all duration-500 hover:border-foreground/20 ${feature.span}`}
            >
              <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-5 group-hover:bg-foreground/10 transition-colors">
                <feature.icon size={24} className="text-foreground/60 group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-barlow font-bold text-xl text-foreground mb-2">{feature.title}</h3>
              <p className="font-barlow text-sm text-foreground/50 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
