import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const painPoints = [
  "Manual invoicing",
  "30-90 day delays",
  "Payment disputes",
  "Currency volatility",
];

const solutions = [
  "Auto-execution",
  "Instant USDC/PYUSD",
  "On-chain escrow",
  "Stable value",
];

const ProblemSolution = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      {/* Left - The Old Way */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={isInView ? { x: 0 } : { x: "-100%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 clip-left bg-[hsl(var(--section-problem))]"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="pl-8 md:pl-20 pr-20 max-w-lg">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="font-barlow font-bold text-3xl md:text-4xl text-destructive/80 mb-8"
            >
              The Old Way
            </motion.h3>
            <div className="space-y-5">
              {painPoints.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <X size={16} className="text-destructive" />
                  </div>
                  <span className="font-barlow font-medium text-primary-foreground/70 text-lg">
                    {point}
                  </span>
                </motion.div>
              ))}
            </div>
            {/* Sad icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 0.3, scale: 1 } : { opacity: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-12 text-6xl"
            >
              😩
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right - The New Way */}
      <motion.div
        initial={{ x: "100%" }}
        animate={isInView ? { x: 0 } : { x: "100%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 clip-right bg-[hsl(var(--section-solution))]"
      >
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="pr-8 md:pr-20 pl-20 max-w-lg">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="font-barlow font-bold text-3xl md:text-4xl text-primary-foreground mb-8"
            >
              The New Way
            </motion.h3>
            <div className="space-y-5">
              {solutions.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                    <Check size={16} className="text-primary-foreground" />
                  </div>
                  <span className="font-barlow font-medium text-primary-foreground/90 text-lg">
                    {point}
                  </span>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 0.3, scale: 1 } : { opacity: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-12 text-6xl"
            >
              🚀
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* VS Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 200 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <motion.div
          animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0.3)", "0 0 0 20px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center"
        >
          <span className="font-barlow font-bold text-2xl text-background">VS</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProblemSolution;
