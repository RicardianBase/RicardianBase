import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, LayoutGrid, List, MoreHorizontal, ArrowUpRight, ChevronDown } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const contracts = [
  { id: "1", title: "Brand Redesign Project", contractor: "Alice Chen", avatar: "AC", status: "Active", statusColor: "bg-emerald-400", progress: 65, amount: "$12,500" },
  { id: "2", title: "API Integration Suite", contractor: "Bob Martinez", avatar: "BM", status: "In Review", statusColor: "bg-amber-400", progress: 90, amount: "$8,200" },
  { id: "3", title: "Mobile App MVP", contractor: "Carol Liu", avatar: "CL", status: "Active", statusColor: "bg-emerald-400", progress: 30, amount: "$25,000" },
  { id: "4", title: "Marketing Campaign Q2", contractor: "David Kim", avatar: "DK", status: "Completed", statusColor: "bg-blue-400", progress: 100, amount: "$5,800" },
  { id: "5", title: "UI/UX Audit", contractor: "Elena Park", avatar: "EP", status: "Disputed", statusColor: "bg-red-400", progress: 45, amount: "$3,200" },
  { id: "6", title: "Cloud Migration", contractor: "Frank Zhao", avatar: "FZ", status: "Active", statusColor: "bg-emerald-400", progress: 55, amount: "$18,000" },
];

const ContractsList = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { ref, isInView } = useInViewAnimation();

  return (
    <div ref={ref} className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        <h1 className="text-2xl font-medium text-gray-900">Contracts</h1>
        <Link
          to="/dashboard/contracts/new"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
        >
          New Contract <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Filters */}
      <div className={`bg-white rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            className="w-full bg-gray-50 border-0 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors">
          Status <ChevronDown size={14} />
        </button>
        <button className="inline-flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors">
          Amount <ChevronDown size={14} />
        </button>
        <div className="flex bg-gray-100 rounded-full p-0.5">
          <button onClick={() => setView("grid")} className={`p-2 rounded-full transition-colors ${view === "grid" ? "bg-white shadow-sm" : ""}`}>
            <LayoutGrid size={16} className="text-gray-600" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 rounded-full transition-colors ${view === "list" ? "bg-white shadow-sm" : ""}`}>
            <List size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {contracts.map((c, i) => (
            <Link
              key={c.id}
              to={`/dashboard/contracts/${c.id}`}
              className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 block group ${isInView ? "animate-fade-in-up" : ""}`}
              style={{ animationDelay: `${0.2 + i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${c.statusColor}`} />
                  <span className="text-xs font-medium text-gray-500">{c.status}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal size={18} className="text-gray-400" />
                </button>
              </div>

              <h3 className="text-base font-medium text-gray-900 mb-2">{c.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600">
                  {c.avatar}
                </div>
                <span className="text-xs text-gray-500">{c.contractor}</span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400">Progress</span>
                  <span className="text-[10px] text-gray-400">{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-800 rounded-full transition-all duration-700" style={{ width: `${c.progress}%` }} />
                </div>
              </div>

              <p className="text-xl font-semibold text-gray-900 text-right">{c.amount}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {contracts.map((c, i) => (
            <Link
              key={c.id}
              to={`/dashboard/contracts/${c.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${i < contracts.length - 1 ? "border-b border-gray-50" : ""}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.statusColor}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                <p className="text-xs text-gray-400">{c.contractor}</p>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">{c.status}</span>
              <div className="w-24 hidden md:block">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-800 rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">{c.amount}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractsList;
