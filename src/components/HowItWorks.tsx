import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserPlus, FileText, Link, PenTool, Wallet, Briefcase, CheckCircle, Zap, Trophy } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Sign Up", description: "Create your account in seconds" },
  { icon: FileText, title: "Create Contract", description: "Pick a template or start custom" },
  { icon: Link, title: "Ricardian Link", description: "Legal + smart contract hash bound" },
  { icon: PenTool, title: "Dual Sign", description: "E-signature + wallet signature" },
  { icon: Wallet, title: "Fund Escrow", description: "Deposit USDC or PYUSD" },
  { icon: Briefcase, title: "Work & Deliver", description: "Submit milestone deliverables" },
  { icon: CheckCircle, title: "Approve", description: "Review and approve work" },
  { icon: Zap, title: "Auto-Pay", description: "Instant release from escrow" },
  { icon: Trophy, title: "Complete", description: "Contract fulfilled, everyone paid" },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-32 bg-[hsl(var(--section-cream))] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-4"
        >
          <span className="font-barlow font-medium text-sm tracking-widest uppercase text-foreground/40">
            How It Works
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-4"
        >
          <span className="font-barlow font-bold text-4xl md:text-5xl text-foreground tracking-tight">
            From Sign-Up{" "}
          </span>
          <span className="font-instrument italic text-4xl md:text-5xl text-foreground">
            to Payday
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-center font-barlow text-foreground/50 text-lg max-w-xl mx-auto mb-20"
        >
          Nine simple steps from contract creation to guaranteed payment.
        </motion.p>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Progress line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            className="hidden lg:block absolute top-16 left-[5%] right-[5%] h-[2px] bg-foreground/10 origin-left"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-foreground/10 origin-left"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <div className="bg-background rounded-2xl p-6 shadow-[0_4px_20px_hsl(var(--foreground)/0.06)] hover:shadow-[0_12px_40px_hsl(var(--foreground)/0.12)] transition-all duration-500">
                  {/* Step number */}
                  <div className="font-barlow font-bold text-5xl text-foreground/[0.06] mb-3 leading-none">
                    0{i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors">
                    <step.icon size={22} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                  </div>
                  <h3 className="font-barlow font-bold text-lg text-foreground mb-1">{step.title}</h3>
                  <p className="font-barlow text-sm text-foreground/50">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
