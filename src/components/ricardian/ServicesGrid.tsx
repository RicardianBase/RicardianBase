import { ArrowRight, ArrowUpRight, RotateCcw, GripHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import escrowIcon from "@/assets/Money_Transfer_Arrow.png";
import hybridIcon from "@/assets/Bill_Payment_Icon.png";
import milestoneIcon from "@/assets/Mobile_Banking_App.png";
import complianceIcon from "@/assets/Safe_Login_Shield.png";

const serviceIcons = [escrowIcon, hybridIcon, milestoneIcon, complianceIcon];

const IconImage = ({ src }: { src: string }) => (
  <div className="w-full h-[240px] flex items-center justify-center bg-white rounded-xl">
    <div className="w-32 h-32 flex items-center justify-center">
      <img src={src} alt="" className="w-full h-full object-contain" />
    </div>
  </div>
);

const iconComponents = serviceIcons.map((src) => () => <IconImage src={src} />);

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
