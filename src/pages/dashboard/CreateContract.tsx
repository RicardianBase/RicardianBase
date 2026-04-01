import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, GripVertical, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const steps = ["Template", "Details", "Milestones", "Summary"];

const templates = [
  { id: "milestone", title: "Milestone-Based", desc: "Break work into phases with staged payments" },
  { id: "fixed", title: "Fixed Price", desc: "Single deliverable with one-time payment" },
  { id: "retainer", title: "Monthly Retainer", desc: "Ongoing work with recurring payments" },
];

const CreateContract = () => {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("milestone");
  const [milestones, setMilestones] = useState([
    { title: "Project Kickoff", amount: "2500" },
    { title: "Design Delivery", amount: "5000" },
  ]);
  const { ref, isInView } = useInViewAnimation();

  const addMilestone = () => setMilestones([...milestones, { title: "", amount: "" }]);

  return (
    <div ref={ref} className="space-y-6 max-w-3xl mx-auto">
      <Link
        to="/dashboard/contracts"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full px-4 py-2 transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <h1 className={`text-2xl font-medium text-gray-900 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        Create Contract
      </h1>

      {/* Step indicator */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                  i < step ? "bg-emerald-500 text-white" : i === step ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-[10px] text-gray-400 mt-1.5 hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className="w-8 sm:w-16 h-px bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Select a contract template</p>
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedTemplate === t.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <p className="text-sm font-medium text-gray-900">{t.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Contract Title</label>
              <input
                type="text"
                placeholder="e.g. Brand Redesign Project"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Contractor Wallet Address</label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-gray-200 transition-shadow"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the scope of work..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition-shadow resize-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Define project milestones</p>
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <GripVertical size={16} className="text-gray-300 cursor-grab flex-shrink-0" />
                <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-500 flex-shrink-0">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={m.title}
                  onChange={(e) => {
                    const updated = [...milestones];
                    updated[i].title = e.target.value;
                    setMilestones(updated);
                  }}
                  placeholder="Milestone title"
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">$</span>
                  <input
                    type="text"
                    value={m.amount}
                    onChange={(e) => {
                      const updated = [...milestones];
                      updated[i].amount = e.target.value;
                      setMilestones(updated);
                    }}
                    placeholder="0"
                    className="w-20 bg-transparent text-sm text-right outline-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addMilestone}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 border border-dashed border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-colors"
            >
              <Plus size={14} /> Add Milestone
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">Review your contract</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Template</span>
                <span className="text-gray-900 font-medium">Milestone-Based</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Milestones</span>
                <span className="text-gray-900 font-medium">{milestones.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Total Value</span>
                <span className="text-gray-900 font-medium">
                  ${milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-50">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`inline-flex items-center gap-1.5 text-sm font-medium border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors ${step === 0 ? "invisible" : ""}`}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
          >
            {step === steps.length - 1 ? "Create Contract" : "Next"} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateContract;
