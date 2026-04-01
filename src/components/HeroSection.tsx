import { Play } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[hsl(var(--section-dark))]">
      <div className="absolute inset-0 grid-pattern opacity-60" />
      
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px]"
      />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block font-barlow font-medium text-sm tracking-widest uppercase text-primary-foreground/50 border border-primary-foreground/10 rounded-full px-5 py-2">
            Legal Contracts Meet Smart Contracts
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-4"
        >
          <span className="block font-barlow font-bold text-primary-foreground tracking-[-3px] text-[clamp(2rem,5vw,3.5rem)] leading-[1.1]">
            Two documents, one truth.
          </span>
          <span className="block font-instrument italic text-primary-foreground text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] mt-2">
            payments you can trust
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-barlow font-medium text-[18px] text-primary-foreground/60 max-w-xl mx-auto mb-10"
        >
          Milestone-based escrow on Base blockchain. Ricardian contracts bind
          legal prose to smart contract code — tamper-proof, instant, non-custodial.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="flex items-center gap-3 bg-primary-foreground text-foreground font-barlow font-semibold text-base px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_8px_30px_rgba(255,255,255,0.15)]">
            <Play size={16} className="fill-current" />
            See How It Works
          </button>
          <button className="font-barlow font-medium text-base text-primary-foreground/70 hover:text-primary-foreground transition-colors px-6 py-4 border border-primary-foreground/20 rounded-full hover:border-primary-foreground/40">
            Read the Docs
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "14s", label: "Avg Pay Time" },
            { value: "$2.4M", label: "Value Secured" },
            { value: "99.99%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-barlow font-bold text-2xl text-primary-foreground">{stat.value}</div>
              <div className="font-barlow text-xs text-primary-foreground/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
