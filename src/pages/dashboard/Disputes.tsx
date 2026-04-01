import { AlertTriangle, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const disputes = [
  { id: 1, title: "UI/UX Audit — Milestone 2 Dispute", contractor: "Elena Park", avatar: "EP", status: "Under Review", amount: "$1,600", desc: "Contractor claims milestone was completed per spec. Client requests revisions." },
  { id: 2, title: "Logo Redesign — Payment Dispute", contractor: "Frank Zhao", avatar: "FZ", status: "Evidence Required", amount: "$4,200", desc: "Disagreement on final deliverable quality. Arbitration initiated." },
];

const Disputes = () => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const { ref, isInView } = useInViewAnimation();

  return (
    <div ref={ref} className="space-y-6">
      <h1 className={`text-2xl font-medium text-foreground ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        Disputes
      </h1>

      {bannerVisible && (
        <div className={`bg-[hsl(40,60%,95%)] border border-[hsl(40,50%,85%)] rounded-xl p-4 flex items-start gap-3 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
          <AlertTriangle size={18} className="text-[hsl(40,70%,40%)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[hsl(40,60%,25%)]">You have 2 active disputes requiring attention</p>
            <p className="text-xs text-[hsl(40,50%,40%)] mt-0.5">Please review and submit evidence to proceed with resolution.</p>
          </div>
          <button onClick={() => setBannerVisible(false)} className="text-[hsl(40,40%,65%)] hover:text-[hsl(40,50%,40%)] flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {disputes.map((d, i) => (
          <div
            key={d.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-[hsl(340,60%,60%)] ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-[hsl(340,40%,94%)] text-[hsl(340,60%,40%)] px-2.5 py-1 rounded-full">{d.status}</span>
                </div>
                <h3 className="text-base font-medium text-foreground">{d.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(250,35%,85%)] to-[hsl(220,40%,80%)] flex items-center justify-center text-[10px] font-medium text-[hsl(250,50%,40%)]">{d.avatar}</div>
                  <span className="text-xs text-muted-foreground">{d.contractor}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{d.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">Amount Locked</p>
                <p className="text-2xl font-semibold text-foreground">{d.amount}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button className="inline-flex items-center gap-1.5 text-xs font-medium border border-[hsl(230,20%,90%)] text-muted-foreground px-4 py-2 rounded-full hover:bg-[hsl(230,25%,96%)] transition-colors">
                View Details <ArrowUpRight size={12} />
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r from-[hsl(250,40%,55%)] to-[hsl(220,50%,55%)] text-white px-4 py-2 rounded-full hover:shadow-lg transition-all">
                Submit Evidence
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Disputes;
