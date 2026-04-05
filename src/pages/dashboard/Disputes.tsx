import { AlertTriangle, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useDisputes } from "@/hooks/api/useDisputes";
import DisputeDetailModal from "@/components/dashboard/DisputeDetailModal";
import type { Dispute } from "@/types/api";

const statusLabels: Record<string, string> = {
  under_review: "Under Review",
  evidence_required: "Evidence Required",
  resolved: "Resolved",
  escalated: "Escalated",
};

const Disputes = () => {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [selected, setSelected] = useState<Dispute | null>(null);
  const { ref, isInView } = useInViewAnimation();
  const { data: response, isLoading } = useDisputes();

  const disputes = response?.data ?? [];
  const activeCount = disputes.filter((d) => d.status !== "resolved").length;

  return (
    <div ref={ref} className="space-y-6">
      <h1 className={`text-2xl font-medium text-foreground ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        Disputes
      </h1>

      {bannerVisible && activeCount > 0 && (
        <div className={`bg-[hsl(40,60%,95%)] border border-[hsl(40,50%,85%)] rounded-xl p-4 flex items-start gap-3 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
          <AlertTriangle size={18} className="text-[hsl(40,70%,40%)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[hsl(40,60%,25%)]">
              You have {activeCount} active dispute{activeCount !== 1 ? "s" : ""} requiring attention
            </p>
            <p className="text-xs text-[hsl(40,50%,40%)] mt-0.5">Please review and submit evidence to proceed with resolution.</p>
          </div>
          <button onClick={() => setBannerVisible(false)} className="text-[hsl(40,40%,65%)] hover:text-[hsl(40,50%,40%)] flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-muted animate-pulse">
              <div className="h-4 bg-muted rounded w-1/4 mb-3" />
              <div className="h-5 bg-muted rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : disputes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-muted-foreground">No disputes</p>
          <p className="text-xs text-muted-foreground/60 mt-1">All your contracts are running smoothly.</p>
        </div>
      ) : (
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
                    <span className="text-xs font-medium bg-[hsl(340,40%,94%)] text-[hsl(340,60%,40%)] px-2.5 py-1 rounded-full">
                      {statusLabels[d.status] ?? d.status}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-foreground">{d.title}</h3>
                  {d.description && (
                    <p className="text-sm text-muted-foreground mt-3">{d.description}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">Amount Locked</p>
                  <p className="text-2xl font-semibold text-foreground">
                    ${d.amount_locked ? parseFloat(d.amount_locked).toLocaleString("en-US", { minimumFractionDigits: 0 }) : "0"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setSelected(d)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium border border-[hsl(230,20%,90%)] text-muted-foreground px-4 py-2 rounded-full hover:bg-[hsl(230,25%,96%)] transition-colors"
                >
                  View Details <ArrowUpRight size={12} />
                </button>
                {d.status !== "resolved" && (
                  <button
                    onClick={() => setSelected(d)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 hover:shadow-lg transition-all"
                  >
                    Submit Evidence
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <DisputeDetailModal dispute={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Disputes;
