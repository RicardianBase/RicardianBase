import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const tabs = [
  "Advancing the science of blockchain-based enterprise agreements",
  "Ricardian Hash Linking — binding legal prose to smart contracts",
  "Base Blockchain Integration — low-cost, high-speed settlement",
  "Stablecoin Orchestration — USDC & PYUSD payment rails",
];

const advantages = [
  { title: "Personalized Contract Solutions", num: "01" },
  { title: "Precision And Accuracy", num: "02" },
  { title: "Scientific Innovation", num: "03" },
];

const ScienceSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { ref, isInView } = useInViewAnimation();

  return (
    <section ref={ref} className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between mb-12 ${isInView ? "animate-fade-in-up" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-medium text-gray-900 leading-tight">
            The Technology Behind<br />Our Platform
          </h2>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-800" />
              <span className="w-2 h-2 rounded-full bg-gray-200" />
            </div>
            <a href="#" className="text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors">
              View Documentation
            </a>
          </div>
        </div>

        <div className={`${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-6">
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronLeft size={14} className="text-gray-600" />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-0 border-t border-gray-100">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`w-full text-left py-4 border-b border-gray-100 flex items-center justify-between transition-colors ${
                  activeTab === i ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span className="text-sm font-medium">{tab}</span>
                {activeTab === i && (
                  <div className="h-0.5 flex-1 mx-4 bg-blue-100 rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-blue-400 rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div
            className={`flex items-center justify-between mb-10 ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            <span className="text-xs text-gray-400">Enterprise-Grade Infrastructure</span>
            <h3 className="text-3xl md:text-4xl font-medium text-gray-900">Our Advantages</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {advantages.map((a, i) => (
              <div
                key={a.num}
                className={`bg-gray-50 rounded-2xl p-6 md:p-8 relative group hover:shadow-md transition-all duration-300 ${isInView ? "animate-fade-in-up" : ""}`}
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-16">
                  <span className="text-[10px] font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1">
                    Advantage
                  </span>
                  <ArrowUpRight size={20} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
                </div>
                <h4 className="text-base font-medium text-gray-900 leading-snug">{a.title}</h4>
                <p className="text-[64px] md:text-[80px] font-light text-gray-200 leading-none mt-4 tracking-tight" style={{ fontFamily: "serif" }}>
                  {a.num}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceSection;
