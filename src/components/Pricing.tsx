import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Info } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    priceNote: "for contractors / 2% per contract for companies",
    features: ["Up to 5 active contracts", "Standard escrow", "Email support", "USDC payments"],
    highlighted: false,
  },
  {
    name: "Professional",
    monthly: 99,
    annual: 79,
    priceNote: "per month",
    features: ["Unlimited contracts", "Priority support", "Custom templates", "USDC + PYUSD", "API access", "Team roles"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "tailored to your organization",
    features: ["Everything in Pro", "Dedicated success manager", "SLA guarantee", "Custom integrations", "On-chain audit reports", "White-label option"],
    highlighted: false,
  },
];

const Pricing = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [annual, setAnnual] = useState(false);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-[hsl(var(--section-teal))]">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <span className="font-barlow font-medium text-sm tracking-widest uppercase text-primary-foreground/40">
            Pricing
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-6"
        >
          <span className="font-barlow font-bold text-4xl md:text-5xl text-primary-foreground tracking-tight">
            Simple,{" "}
          </span>
          <span className="font-instrument italic text-4xl md:text-5xl text-primary-foreground">
            Transparent
          </span>
        </motion.h2>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-16"
        >
          <span className={`font-barlow text-sm ${!annual ? "text-primary-foreground" : "text-primary-foreground/40"}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 rounded-full bg-primary-foreground/20 transition-colors"
          >
            <motion.div
              animate={{ x: annual ? 28 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-primary-foreground"
            />
          </button>
          <span className={`font-barlow text-sm ${annual ? "text-primary-foreground" : "text-primary-foreground/40"}`}>
            Annual <span className="text-xs text-primary-foreground/30">(save 20%)</span>
          </span>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`rounded-2xl p-8 transition-all ${
                plan.highlighted
                  ? "glass-card bg-primary-foreground/10 shadow-[0_0_60px_hsl(var(--primary-foreground)/0.08)] scale-105"
                  : "glass-card"
              }`}
            >
              <h3 className="font-barlow font-bold text-lg text-primary-foreground mb-2">{plan.name}</h3>
              <div className="mb-1">
                {plan.monthly ? (
                  <span className="font-barlow font-bold text-4xl text-primary-foreground">
                    ${annual ? plan.annual : plan.monthly}
                  </span>
                ) : (
                  <span className="font-barlow font-bold text-4xl text-primary-foreground">{plan.price}</span>
                )}
              </div>
              <p className="font-barlow text-xs text-primary-foreground/40 mb-6">{plan.priceNote}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={14} className="text-primary-foreground/50 flex-shrink-0" />
                    <span className="font-barlow text-sm text-primary-foreground/70">{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full font-barlow font-medium text-sm py-3 rounded-full transition-all ${
                plan.highlighted
                  ? "bg-primary-foreground text-foreground hover:opacity-90"
                  : "border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              }`}>
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* No hidden fees badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex items-center justify-center gap-2 mt-8"
        >
          <Info size={14} className="text-primary-foreground/30" />
          <span className="font-barlow text-xs text-primary-foreground/30">
            No hidden fees. Gas costs covered on Base L2.
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
