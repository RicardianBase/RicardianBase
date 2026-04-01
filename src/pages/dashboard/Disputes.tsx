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
      <h1 className={`text-2xl font-medium text-gray-900 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        Disputes
      </h1>

      {/* Alert banner */}
      {bannerVisible && (
        <div className={`bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">You have 2 active disputes requiring attention</p>
            <p className="text-xs text-amber-600 mt-0.5">Please review and submit evidence to proceed with resolution.</p>
          </div>
          <button onClick={() => setBannerVisible(false)} className="text-amber-400 hover:text-amber-600 flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Dispute cards */}
      <div className="space-y-4">
        {disputes.map((d, i) => (
          <div
            key={d.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-red-300 ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full">{d.status}</span>
                </div>
                <h3 className="text-base font-medium text-gray-900">{d.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">{d.avatar}</div>
                  <span className="text-xs text-gray-500">{d.contractor}</span>
                </div>
                <p className="text-sm text-gray-500 mt-3">{d.desc}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">Amount Locked</p>
                <p className="text-2xl font-semibold text-gray-900">{d.amount}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button className="inline-flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                View Details <ArrowUpRight size={12} />
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
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
