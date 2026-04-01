import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, CheckCircle, Shield, Clock, FileText } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const milestones = [
  { num: 1, title: "Project Kickoff & Research", desc: "Initial discovery, stakeholder interviews", amount: "$2,500", status: "Approved", statusColor: "bg-emerald-50 text-emerald-700" },
  { num: 2, title: "Wireframes & Prototyping", desc: "Low and high fidelity wireframes", amount: "$3,000", status: "Approved", statusColor: "bg-emerald-50 text-emerald-700" },
  { num: 3, title: "Visual Design System", desc: "Complete design system with components", amount: "$4,000", status: "Submitted", statusColor: "bg-amber-50 text-amber-700" },
  { num: 4, title: "Final Delivery & Handoff", desc: "Developer handoff with documentation", amount: "$3,000", status: "Pending", statusColor: "bg-gray-50 text-gray-500" },
];

const ContractDetail = () => {
  const [tab, setTab] = useState<"legal" | "smart">("legal");
  const { ref, isInView } = useInViewAnimation();

  return (
    <div ref={ref} className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link
        to="/dashboard/contracts"
        className={`inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full px-4 py-2 transition-colors ${isInView ? "animate-fade-in-up" : ""}`}
        style={{ animationDelay: "0.05s" }}
      >
        <ArrowLeft size={14} /> Back to contracts
      </Link>

      {/* Header card */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-medium text-gray-900">Brand Redesign Project</h1>
            <p className="text-sm text-gray-400 mt-1">Created Dec 15, 2025</p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
          </span>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-0.5 mt-6 w-fit">
          <button
            onClick={() => setTab("legal")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${tab === "legal" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Legal Document
          </button>
          <button
            onClick={() => setTab("smart")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${tab === "smart" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
          >
            Smart Contract
          </button>
        </div>
      </div>

      {/* Document viewer */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
        <div className="border border-gray-100 rounded-xl p-6 max-h-[300px] overflow-y-auto text-sm text-gray-600 leading-relaxed">
          {tab === "legal" ? (
            <>
              <h3 className="font-medium text-gray-900 mb-3">SERVICE AGREEMENT</h3>
              <p className="mb-3">This Service Agreement ("Agreement") is entered into between the Client and Contractor for the purpose of completing the Brand Redesign Project as outlined in the attached scope of work.</p>
              <p className="mb-3"><strong>1. Scope of Work.</strong> The Contractor agrees to deliver a comprehensive brand redesign including logo, typography system, color palette, and brand guidelines document.</p>
              <p className="mb-3"><strong>2. Payment Terms.</strong> Total project value of $12,500 USD shall be distributed across four milestones as outlined in the Milestone Schedule. Payments are released upon approval of each milestone deliverable.</p>
              <p><strong>3. Timeline.</strong> The project shall be completed within 8 weeks from the effective date of this agreement, subject to timely feedback from the Client.</p>
            </>
          ) : (
            <pre className="font-mono text-xs text-gray-500 whitespace-pre-wrap">
{`// SPDX-License-Identifier: MIT
contract BrandRedesign {
  address public client;
  address public contractor;
  uint256 public totalValue = 12500e6; // USDC
  
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
          <p className="text-xs text-gray-400 mb-1">Escrow Balance</p>
          <p className="text-3xl font-semibold text-gray-900">$7,000</p>
          <p className="text-xs text-gray-400 mt-1">Available for release</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">AC</div>
            <div>
              <p className="text-sm font-medium text-gray-900">Alice Chen</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs text-gray-400 font-mono">0x1a2b...7f8e</span>
                <button className="text-gray-400 hover:text-gray-600"><Copy size={12} /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-emerald-500" />
            <p className="text-xs text-gray-400">Ricardian Hash</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 font-mono">Qm3x9k...v7nP</span>
            <CheckCircle size={12} className="text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-gray-400" />
            <p className="text-xs text-gray-400">Contract Type</p>
          </div>
          <p className="text-sm font-medium text-gray-900">Milestone-Based Escrow</p>
        </div>
      </div>

      {/* Milestone tracker */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.25s" }}>
        <h2 className="text-base font-medium text-gray-900 mb-6">Milestones</h2>
        <div className="space-y-0">
          {milestones.map((m, i) => (
            <div key={m.num} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  m.status === "Approved"
                    ? "bg-emerald-500 text-white"
                    : m.status === "Submitted"
                    ? "bg-amber-100 text-amber-700 ring-2 ring-amber-200"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {m.num}
                </div>
                {i < milestones.length - 1 && <div className="w-px h-full min-h-[40px] bg-gray-100 my-1" />}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-6 ${i < milestones.length - 1 ? "border-b border-gray-50" : ""} mb-2`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900">{m.title}</h3>
                  <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full w-fit ${m.statusColor}`}>
                    {m.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{m.desc}</p>
                <p className="text-sm font-semibold text-gray-900">{m.amount}</p>

                {m.status === "Submitted" && (
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs font-medium bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors">
                      Approve
                    </button>
                    <button className="text-xs font-medium border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                      Request Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
