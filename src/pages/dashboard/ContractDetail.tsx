import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Copy, CheckCircle, Shield, Clock, FileText } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useContract } from "@/hooks/api/useContracts";
import { useMilestoneAction } from "@/hooks/api/useMilestones";
import type { MilestoneStatus } from "@/types/api";

const statusColorMap: Record<MilestoneStatus, string> = {
  approved: "bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)]",
  paid: "bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)]",
  submitted: "bg-[hsl(40,60%,92%)] text-[hsl(40,70%,35%)]",
  in_progress: "bg-[hsl(220,60%,92%)] text-[hsl(220,70%,35%)]",
  pending: "bg-[hsl(230,20%,94%)] text-muted-foreground",
  rejected: "bg-[hsl(340,40%,94%)] text-[hsl(340,60%,40%)]",
};

const statusLabels: Record<MilestoneStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
};

const contractStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  active: "bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)]",
  in_review: "bg-[hsl(40,60%,92%)] text-[hsl(40,70%,35%)]",
  completed: "bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)]",
  disputed: "bg-[hsl(340,40%,94%)] text-[hsl(340,60%,40%)]",
  cancelled: "bg-gray-100 text-gray-500",
};

function formatAmount(amount: string): string {
  return `$${parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<"legal" | "smart">("legal");
  const { ref, isInView } = useInViewAnimation();

  const { data: contract, isLoading } = useContract(id!);
  const milestoneAction = useMilestoneAction(id!);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl animate-pulse">
        <div className="h-8 w-32 bg-muted rounded-full" />
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="h-6 bg-muted rounded w-1/2 mb-2" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm h-48" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Contract not found</p>
        <Link to="/dashboard/contracts" className="text-emerald-600 text-sm mt-2 inline-block">
          Back to contracts
        </Link>
      </div>
    );
  }

  const milestones = contract.milestones ?? [];
  const contractorName = contract.contractor?.display_name ?? "Unassigned";
  const contractorInitials = getInitials(contract.contractor?.display_name);
  const contractorWallet = contract.contractor_wallet
    ? `${contract.contractor_wallet.slice(0, 6)}...${contract.contractor_wallet.slice(-4)}`
    : "N/A";

  const escrowBalance = milestones
    .filter((m) => m.status !== "paid" && m.status !== "approved")
    .reduce((sum, m) => sum + parseFloat(m.amount), 0);

  return (
    <div ref={ref} className="space-y-6 max-w-5xl">
      <Link
        to="/dashboard/contracts"
        className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-[hsl(230,20%,90%)] rounded-full px-4 py-2 transition-colors ${isInView ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "0.05s" }}
      >
        <ArrowLeft size={14} /> Back to contracts
      </Link>

      {/* Header card */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-medium text-foreground">{contract.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Created {new Date(contract.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full w-fit ${contractStatusColors[contract.status]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            {contract.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </div>

        <div className="flex bg-[hsl(230,25%,94%)] rounded-full p-0.5 mt-6 w-fit">
          <button
            onClick={() => setTab("legal")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${tab === "legal" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Legal Document
          </button>
          <button
            onClick={() => setTab("smart")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${tab === "smart" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Smart Contract
          </button>
        </div>
      </div>

      {/* Document viewer */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
        <div className="border border-[hsl(230,20%,92%)] rounded-xl p-6 max-h-[300px] overflow-y-auto text-sm text-muted-foreground leading-relaxed">
          {tab === "legal" ? (
            <>
              <h3 className="font-medium text-foreground mb-3">SERVICE AGREEMENT</h3>
              <p className="mb-3">
                This Service Agreement ("Agreement") is entered into between the Client and Contractor
                for the purpose of completing the {contract.title} as outlined in the attached scope of work.
              </p>
              {contract.description && <p className="mb-3">{contract.description}</p>}
              <p className="mb-3">
                <strong>Payment Terms.</strong> Total project value of {formatAmount(contract.total_amount)} {contract.currency} shall
                be distributed across {milestones.length} milestones as outlined in the Milestone Schedule.
              </p>
            </>
          ) : (
            <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
{`// SPDX-License-Identifier: MIT
contract ${contract.title.replace(/\s+/g, "")} {
  address public client;
  address public contractor;
  uint256 public totalValue = ${parseFloat(contract.total_amount)}e6; // ${contract.currency}

  enum Status { Pending, InProgress, Submitted, Approved }

  struct Milestone {
    string title;
    uint256 amount;
    Status status;
  }

  Milestone[] public milestones;

  function approveMilestone(uint256 id) external {
    require(msg.sender == client);
    milestones[id].status = Status.Approved;
    // Release funds...
  }
}`}
            </pre>
          )}
        </div>
      </div>

      {/* Info grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-xs text-muted-foreground mb-1">Escrow Balance</p>
          <p className="text-3xl font-semibold text-foreground">${escrowBalance.toLocaleString("en-US", { minimumFractionDigits: 0 })}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Available for release</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">
              {contractorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{contractorName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs text-muted-foreground font-mono">{contractorWallet}</span>
                <button className="text-muted-foreground hover:text-foreground"><Copy size={12} /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-[hsl(160,50%,45%)]" />
            <p className="text-xs text-muted-foreground">Contract ID</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground font-mono">{contract.id.slice(0, 8)}...{contract.id.slice(-4)}</span>
            <CheckCircle size={12} className="text-[hsl(160,50%,45%)]" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Currency</p>
          </div>
          <p className="text-sm font-medium text-foreground">{contract.currency}</p>
        </div>
      </div>

      {/* Milestone tracker */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.25s" }}>
        <h2 className="text-base font-medium text-foreground mb-6">Milestones</h2>
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No milestones</p>
        ) : (
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                    m.status === "approved" || m.status === "paid"
                      ? "bg-[hsl(160,50%,45%)] text-white"
                      : m.status === "submitted"
                      ? "bg-[hsl(40,60%,90%)] text-[hsl(40,70%,35%)] ring-2 ring-[hsl(40,60%,80%)]"
                      : "bg-[hsl(230,25%,94%)] text-muted-foreground"
                  }`}>
                    {m.sequence}
                  </div>
                  {i < milestones.length - 1 && <div className="w-px h-full min-h-[40px] bg-[hsl(230,20%,92%)] my-1" />}
                </div>

                <div className={`flex-1 pb-6 ${i < milestones.length - 1 ? "border-b border-[hsl(230,20%,94%)]" : ""} mb-2`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground">{m.title}</h3>
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full w-fit ${statusColorMap[m.status]}`}>
                      {statusLabels[m.status]}
                    </span>
                  </div>
                  {m.description && <p className="text-xs text-muted-foreground mb-1">{m.description}</p>}
                  <p className="text-sm font-semibold text-foreground">{formatAmount(m.amount)}</p>

                  {m.status === "submitted" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => milestoneAction.mutate({ milestoneId: m.id, status: "approved" })}
                        disabled={milestoneAction.isPending}
                        className="text-xs font-medium bg-[hsl(160,40%,92%)] text-[hsl(160,50%,35%)] px-4 py-2 rounded-full hover:bg-[hsl(160,40%,87%)] transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => milestoneAction.mutate({ milestoneId: m.id, status: "rejected" })}
                        disabled={milestoneAction.isPending}
                        className="text-xs font-medium border border-[hsl(230,20%,90%)] text-muted-foreground px-4 py-2 rounded-full hover:bg-[hsl(230,25%,96%)] transition-colors disabled:opacity-50"
                      >
                        Request Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetail;
