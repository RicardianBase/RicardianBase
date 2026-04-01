import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUp, Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  Product: ["Smart Escrow", "Milestones", "Ricardian Contracts", "Dispute Resolution"],
  Company: ["About", "Blog", "Careers", "Press Kit"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
  Resources: ["Documentation", "API Reference", "Status", "Community"],
};

const SiteFooter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative bg-foreground overflow-hidden">
      {/* Starfield dots */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
            className="absolute w-[2px] h-[2px] bg-background/40 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="py-24 text-center border-b border-background/10"
        >
          <h2 className="font-barlow font-bold text-3xl md:text-4xl text-background mb-3 tracking-tight">
            Ready to never chase a payment again?
          </h2>
          <p className="font-instrument italic text-2xl md:text-3xl text-background/50 mb-10">
            Start building trust today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full sm:flex-1 font-barlow text-sm bg-background/10 border border-background/10 rounded-full px-6 py-3.5 text-background placeholder:text-background/30 focus:outline-none focus:border-background/30"
            />
            <button className="w-full sm:w-auto font-barlow font-semibold text-sm bg-background text-foreground px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
              Get Early Access
            </button>
          </div>
        </motion.div>

        {/* Links grid */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            >
              <h4 className="font-barlow font-bold text-sm text-background/80 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="font-barlow text-sm text-background/40 hover:text-background/70 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-barlow font-bold text-sm text-background/60">RicardianBase</span>
            <span className="font-barlow text-xs text-background/30">© 2026 All rights reserved</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="font-barlow text-xs text-background/30">All Systems Operational</span>
          </div>

          <div className="flex items-center gap-4">
            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, y: -2 }}
                className="w-8 h-8 rounded-full bg-background/5 flex items-center justify-center hover:bg-background/10 transition-colors"
              >
                <Icon size={14} className="text-background/50" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-foreground border border-background/20 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <ArrowUp size={18} className="text-background" />
      </motion.button>
    </footer>
  );
};

export default SiteFooter;
