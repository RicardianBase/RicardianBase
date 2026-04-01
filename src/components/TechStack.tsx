import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Cpu, Database, Wallet, Globe, Server } from "lucide-react";

const techItems = [
  { icon: Database, name: "Base L2", description: "Ethereum L2 for fast, cheap transactions" },
  { icon: Shield, name: "USDC", description: "Circle's regulated stablecoin" },
  { icon: Wallet, name: "PYUSD", description: "PayPal's dollar-pegged stablecoin" },
  { icon: Cpu, name: "MetaMask", description: "Industry-standard wallet" },
  { icon: Globe, name: "Coinbase Wallet", description: "Seamless onboarding" },
  { icon: Server, name: "IPFS / Arweave", description: "Permanent document storage" },
];

const TechStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-primary circuit-pattern">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <span className="font-barlow font-medium text-sm tracking-widest uppercase text-primary-foreground/40">
            Technology Stack
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-16"
        >
          <span className="font-barlow font-bold text-4xl md:text-5xl text-primary-foreground tracking-tight">
            Powered By{" "}
          </span>
          <span className="font-instrument italic text-4xl md:text-5xl text-primary-foreground">
            Base
          </span>
        </motion.h2>

        {/* Hex grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          {techItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 text-center hover:bg-primary-foreground/10 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                <item.icon size={28} className="text-primary-foreground/70" />
              </div>
              <h3 className="font-barlow font-bold text-base text-primary-foreground mb-1">{item.name}</h3>
              <p className="font-barlow text-xs text-primary-foreground/40">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.7 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
        >
          {["99.99% Uptime", "Bank-Grade Security", "Non-Custodial"].map((stat) => (
            <div key={stat} className="flex items-center gap-2">
              <Shield size={14} className="text-primary-foreground/40" />
              <span className="font-barlow font-medium text-sm text-primary-foreground/60">{stat}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
