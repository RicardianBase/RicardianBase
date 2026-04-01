import { ArrowRight, ArrowUpRight, RotateCcw, GripHorizontal } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const useInViewActive = () => {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, active };
};

const EscrowIcon = () => {
  const { ref, active } = useInViewActive();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setPulse(p => p + 1), 2500);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div ref={ref} className="w-full h-[240px] flex items-center justify-center bg-gradient-to-br from-[hsl(140,25%,95%)] via-[hsl(150,20%,93%)] to-[hsl(160,25%,90%)] rounded-xl overflow-hidden relative">
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: active ? 0.15 : 0 }}>
        <circle cx="50%" cy="50%" r="60" fill="none" stroke="hsl(140,35%,50%)" strokeWidth="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 150 120" to="360 150 120" dur="15s" repeatCount="indefinite" />
        </circle>
        <circle cx="50%" cy="50%" r="85" fill="none" stroke="hsl(150,40%,55%)" strokeWidth="0.5" strokeDasharray="3 5">
          <animateTransform attributeName="transform" type="rotate" from="360 150 120" to="0 150 120" dur="20s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="relative w-36 h-36">
        <div className="absolute inset-0 rounded-full border-2 border-[hsl(140,35%,55%)]/30 transition-all duration-1000 ease-out" style={{ transform: active ? "scale(1)" : "scale(0.5)", opacity: active ? 1 : 0 }} />
        <div className="absolute inset-4 rounded-full transition-all duration-1000 ease-out" style={{ background: "radial-gradient(circle, hsl(140,40%,55%,0.12) 0%, transparent 70%)", transform: active ? "scale(1)" : "scale(0)", opacity: active ? 1 : 0, transitionDelay: "0.2s" }} />
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out" style={{ transform: active ? "translateY(0) scale(1)" : "translateY(10px) scale(0.8)", opacity: active ? 1 : 0, transitionDelay: "0.3s" }}>
          <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
            <rect x="4" y="18" width="32" height="22" rx="4" stroke="hsl(140,38%,40%)" strokeWidth="1.5" />
            <path d="M12 18V12C12 7.58 15.58 4 20 4C24.42 4 28 7.58 28 12V18" stroke="hsl(140,38%,40%)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="20" cy="29" r="3" fill="hsl(140,40%,45%)" opacity="0.4" />
          </svg>
        </div>
        {[0, 120, 240].map((deg, i) => (
          <div key={i} className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(140,40%,45%)] to-[hsl(160,45%,50%)] flex items-center justify-center text-[9px] font-bold text-white shadow-md transition-all duration-1000 ease-out"
            style={{ top: "50%", left: "50%", transform: active ? `rotate(${deg + pulse * 30}deg) translateX(56px) rotate(-${deg + pulse * 30}deg)` : `rotate(${deg}deg) translateX(20px) rotate(-${deg}deg)`, opacity: active ? 1 : 0, transitionDelay: `${0.5 + i * 0.15}s` }}>$</div>
        ))}
      </div>
    </div>
  );
};

const RicardianIcon = () => {
  const { ref, active } = useInViewActive();
  return (
    <div ref={ref} className="w-full h-[240px] flex items-center justify-center bg-gradient-to-br from-[hsl(145,22%,95%)] via-[hsl(140,20%,93%)] to-[hsl(150,25%,90%)] rounded-xl overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[hsl(140,40%,50%)] via-[hsl(150,38%,55%)] to-[hsl(160,42%,48%)] transition-all duration-1000 ease-out" style={{ width: active ? "120px" : "0px", opacity: active ? 0.5 : 0, transitionDelay: "0.4s" }} />
      <div className="relative flex items-center gap-8">
        <div className="w-[72px] h-[88px] rounded-xl border border-[hsl(140,25%,80%)] bg-white shadow-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-700 ease-out" style={{ transform: active ? "translateX(0) rotate(0deg)" : "translateX(30px) rotate(5deg)", opacity: active ? 1 : 0 }}>
          <div className="w-9 h-1.5 bg-[hsl(140,25%,85%)] rounded-full" />
          <div className="w-7 h-1.5 bg-[hsl(140,25%,88%)] rounded-full" />
          <div className="w-8 h-1.5 bg-[hsl(140,25%,85%)] rounded-full" />
          <span className="text-[8px] font-medium text-[hsl(140,40%,38%)] mt-1 bg-[hsl(140,30%,94%)] px-2 py-0.5 rounded">PDF</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 transition-all duration-700 ease-out" style={{ opacity: active ? 1 : 0, transitionDelay: "0.5s", transform: active ? "scale(1)" : "scale(0.5)" }}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(140,40%,42%)] to-[hsl(160,42%,48%)] flex items-center justify-center shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[8px] text-[hsl(140,40%,38%)] font-mono font-medium">SHA-256</span>
        </div>
        <div className="w-[72px] h-[88px] rounded-xl border border-[hsl(150,25%,80%)] bg-white shadow-lg flex flex-col items-center justify-center gap-1.5 transition-all duration-700 ease-out" style={{ transform: active ? "translateX(0) rotate(0deg)" : "translateX(-30px) rotate(-5deg)", opacity: active ? 1 : 0, transitionDelay: "0.2s" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="hsl(150,40%,42%)" strokeWidth="1.5" />
            <path d="M8 8h8M8 12h5M8 16h6" stroke="hsl(150,40%,48%)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[8px] font-medium text-[hsl(150,40%,38%)] bg-[hsl(150,30%,94%)] px-2 py-0.5 rounded font-mono">0x…</span>
        </div>
      </div>
    </div>
  );
};

const AutoExecIcon = () => {
  const { ref, active } = useInViewActive();
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const id = setInterval(() => { setActiveStep(i % 4); i++; }, 800);
    setTimeout(() => clearInterval(id), 4000);
    return () => clearInterval(id);
  }, [active]);

  const steps = [
    { label: "Submit", color: "from-[hsl(140,40%,42%)] to-[hsl(145,38%,38%)]" },
    { label: "Review", color: "from-[hsl(145,38%,40%)] to-[hsl(150,40%,38%)]" },
    { label: "Approve", color: "from-[hsl(150,42%,38%)] to-[hsl(155,40%,35%)]" },
  ];

  return (
    <div ref={ref} className="w-full h-[240px] flex items-center justify-center bg-gradient-to-br from-[hsl(150,22%,95%)] via-[hsl(145,20%,93%)] to-[hsl(140,25%,90%)] rounded-xl overflow-hidden relative">
      <div className="flex flex-col items-center gap-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3 transition-all duration-500 ease-out" style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)", transitionDelay: `${i * 0.2}s` }}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${activeStep >= i ? `bg-gradient-to-br ${step.color} text-white shadow-lg` : "bg-white border border-[hsl(140,20%,85%)] text-muted-foreground"}`}>
              {activeStep >= i ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium w-16 transition-colors duration-300 ${activeStep >= i ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
            {i < 2 && <div className="w-px h-4 ml-1 transition-all duration-500" style={{ backgroundColor: activeStep > i ? "hsl(140,40%,45%)" : "hsl(140,15%,85%)" }} />}
          </div>
        ))}
        <div className="mt-2 w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(140,45%,42%)] to-[hsl(160,42%,38%)] flex items-center justify-center shadow-lg transition-all duration-500 ease-out" style={{ opacity: activeStep >= 2 ? 1 : 0, transform: activeStep >= 2 ? "scale(1)" : "scale(0.3)" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" className="text-white"><path d="M5 10l4 4 6-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        </div>
      </div>
    </div>
  );
};

const ComplianceIcon = () => {
  const { ref, active } = useInViewActive();
  return (
    <div ref={ref} className="w-full h-[240px] flex items-center justify-center bg-gradient-to-br from-[hsl(135,22%,95%)] via-[hsl(145,20%,93%)] to-[hsl(155,25%,90%)] rounded-xl overflow-hidden relative">
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: active ? 0.05 : 0, transition: "opacity 1s" }}>
        {Array.from({ length: 6 }, (_, i) => (<line key={i} x1="0" y1={i * 48} x2="300" y2={i * 48} stroke="hsl(140,35%,45%)" strokeWidth="0.5" />))}
      </svg>
      <div className="relative">
        <svg width="52" height="60" viewBox="0 0 48 56" fill="none" className="transition-all duration-700 ease-out" style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0) scale(1)" : "translateY(15px) scale(0.8)" }}>
          <defs><linearGradient id="shield-grad-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="hsl(140,40%,42%)" /><stop offset="100%" stopColor="hsl(160,42%,48%)" /></linearGradient></defs>
          <path d="M24 2L4 12v16c0 14.36 8.54 24.62 20 28 11.46-3.38 20-13.64 20-28V12L24 2z" stroke="url(#shield-grad-g)" strokeWidth="2" fill="none" />
          <path d="M16 28l6 6 10-12" stroke="url(#shield-grad-g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 30, strokeDashoffset: active ? 0 : 30, transition: "stroke-dashoffset 0.8s ease-out 0.5s" }} />
        </svg>
        {[
          { label: "KYC", color: "from-[hsl(140,40%,42%)] to-[hsl(155,38%,48%)]" },
          { label: "AML", color: "from-[hsl(150,42%,40%)] to-[hsl(160,40%,45%)]" },
          { label: "SOC2", color: "from-[hsl(130,38%,38%)] to-[hsl(145,40%,44%)]" },
        ].map((badge, i) => (
          <div key={i} className={`absolute bg-gradient-to-r ${badge.color} text-white rounded-full px-2.5 py-1 text-[9px] font-bold shadow-md transition-all duration-700 ease-out`}
            style={{ top: `${8 + i * 20}px`, right: "-48px", opacity: active ? 1 : 0, transform: active ? "translateX(0) scale(1)" : "translateX(-15px) scale(0.7)", transitionDelay: `${0.7 + i * 0.15}s` }}>{badge.label}</div>
        ))}
      </div>
    </div>
  );
};

const iconComponents = [EscrowIcon, RicardianIcon, AutoExecIcon, ComplianceIcon];

const services = [
  { pills: ["Smart Escrow"], title: "Automated Escrow Payments", price: "$320", priceSuffix: ".00", desc: "Milestone-based escrow for guaranteed payments", backTitle: "How Smart Escrow Works", backDetails: ["Company deposits USDC/PYUSD into the smart contract's escrow upon contract creation.", "Funds are visible to both parties but untouchable until milestones are approved.", "When a milestone is approved, payment releases instantly — no invoices, no AP department.", "Configurable timeout enforcement: if review isn't completed in time, auto-release kicks in."] },
  { pills: ["Ricardian Linking"], title: "Hybrid Contract Generation", price: "≈$2.5k", priceSuffix: "", desc: "Cryptographic hash linking legal prose to smart contracts", backTitle: "The Ricardian Magic", backDetails: ["System simultaneously generates a human-readable legal contract (PDF) and a matching Base smart contract.", "A cryptographic hash permanently links the two — creating tamper-proof bond.", "Both parties sign with electronic signature (ESIGN Act) and wallet signature (Base blockchain).", "Any post-signing modification to the legal document is instantly detectable via hash mismatch."] },
  { pills: ["Auto-Execution"], title: "Milestone Auto-Payments", price: "$5,000", priceSuffix: ".00", desc: "Click approve → instant stablecoin settlement", backTitle: "Auto-Pay Workflow", backDetails: ["Contractor submits deliverables through the platform for each milestone.", "Company reviews and clicks 'Approve' — smart contract instantly releases payment to contractor's wallet.", "Payment in USDC or PYUSD — always worth $1 USD, zero crypto volatility.", "Full audit trail stored permanently on Base blockchain for compliance."] },
  { pills: ["KYC/AML"], title: "Compliance & Verification", price: "$1,200", priceSuffix: ".00", desc: "Enterprise-grade identity verification built in", backTitle: "Compliance Built In", backDetails: ["Every user (companies and contractors) must verify identity before creating or signing contracts.", "Integrated third-party KYC/AML provider for global identity checks.", "SOC 2 Type II certification-ready architecture from day one.", "Compliant with GENIUS Act federal stablecoin framework and relevant data protection laws."] },
];

const FlipCard = ({ service, index, isInView }: { service: typeof services[0]; index: number; isInView: boolean }) => {
  const [flipped, setFlipped] = useState(false);
  const IconComp = iconComponents[index];

  return (
    <div className={`min-w-[300px] md:min-w-[340px] flex-shrink-0 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: `${0.2 + index * 0.1}s`, perspective: "1000px" }}>
      <div className="relative w-full transition-transform duration-700 ease-out cursor-pointer" style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }} onClick={() => setFlipped(!flipped)}>
        {/* Front */}
        <div className="w-full border border-border rounded-2xl p-4 bg-card hover:shadow-xl hover:shadow-[hsl(140,30%,45%)]/10 transition-all duration-300" style={{ backfaceVisibility: "hidden" }}>
          <div className="relative rounded-xl overflow-hidden">
            <IconComp />
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {service.pills.map((pill) => (
                <span key={pill} className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full shadow-sm border border-[hsl(140,25%,88%)]">{pill}</span>
              ))}
            </div>
            <div className="absolute top-3 right-3">
              <span className="bg-white/80 backdrop-blur-sm text-muted-foreground text-[10px] px-2 py-1 rounded-full flex items-center gap-1"><RotateCcw size={10} /> Tap for details</span>
            </div>
          </div>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">{service.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{service.desc}</p>
              <p className="text-3xl font-medium text-foreground mt-3">{service.price}<span className="text-lg text-muted-foreground">{service.priceSuffix}</span></p>
            </div>
            <span className="mt-1 text-[hsl(140,38%,40%)] hover:text-foreground transition-colors"><ArrowUpRight size={20} /></span>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 w-full border border-border rounded-2xl p-6 bg-gradient-to-br from-card to-[hsl(140,20%,97%)] flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-medium text-white bg-gradient-to-r from-[hsl(140,40%,42%)] to-[hsl(160,42%,48%)] rounded-full px-3 py-1">{service.pills[0]}</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><RotateCcw size={10} /> Tap to flip back</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-4">{service.backTitle}</h3>
            <div className="space-y-3">
              {service.backDetails.map((detail, j) => (
                <div key={j} className="flex gap-2">
                  <span className="text-xs font-bold text-[hsl(140,40%,42%)] mt-0.5 flex-shrink-0">0{j + 1}</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-2xl font-medium text-foreground">{service.price}<span className="text-sm text-muted-foreground ml-1">{service.priceSuffix}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesGrid = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { ref, isInView } = useInViewAnimation();

  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0)); setScrollLeft(scrollRef.current?.scrollLeft || 0); };
  const handleMouseMove = (e: React.MouseEvent) => { if (!isDragging || !scrollRef.current) return; e.preventDefault(); const x = e.pageX - scrollRef.current.offsetLeft; scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 1.5; };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <section ref={ref} className="bg-background py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-12 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
          <div>
            <span className="text-xs font-medium text-[hsl(140,40%,40%)] tracking-wider uppercase mb-3 block">✦ Our Services</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-foreground leading-[1.1]" style={{ fontFamily: "'Instrument Serif', serif" }}>Platform<br />Services</h2>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end gap-3">
            <p className="text-sm text-muted-foreground max-w-xs md:text-right">A comprehensive suite of Ricardian contract services covering the full lifecycle of tech contractor engagements.</p>
            <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-gradient-to-r from-[hsl(140,40%,40%)] to-[hsl(160,42%,45%)] rounded-full px-5 py-2.5 hover:shadow-lg hover:shadow-[hsl(140,35%,40%)]/20 transition-all">Schedule Demo <ArrowRight size={14} /></a>
          </div>
        </div>
        <div className={`flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
          <span>{"<"}</span><GripHorizontal size={14} /><span>DRAG · TAP TO FLIP</span><span>{">"}</span>
        </div>
        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {services.map((s, i) => (<FlipCard key={i} service={s} index={i} isInView={isInView} />))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
