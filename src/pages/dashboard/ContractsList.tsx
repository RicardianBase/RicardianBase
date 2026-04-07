import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, LayoutGrid, List, MoreHorizontal, ArrowUpRight, ChevronDown } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useContracts } from "@/hooks/api/useContracts";
import type { Contract, ContractStatus } from "@/types/api";

const statusColors: Record<ContractStatus, string> = {
  draft: "bg-gray-400",
  active: "bg-emerald-500",
  in_review: "bg-[hsl(40,80%,55%)]",
  completed: "bg-emerald-700",
  disputed: "bg-[hsl(340,60%,50%)]",
  cancelled: "bg-gray-500",
};

const statusLabels: Record<ContractStatus, string> = {
  draft: "Draft",
  active: "Active",
  in_review: "In Review",
  completed: "Completed",
  disputed: "Disputed",
  cancelled: "Cancelled",
};

function getContractorLabel(c: Contract): string {
  if (c.contractor?.username) return `@${c.contractor.username}`;
  if (c.contractor?.display_name) return c.contractor.display_name;
  return "Unassigned";
}

function getContractorInitials(c: Contract): string {
  if (c.contractor?.username) return c.contractor.username.slice(0, 2).toUpperCase();
  if (c.contractor?.display_name) {
    return c.contractor.display_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  }
  return "??";
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

const ContractsList = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const { ref, isInView } = useInViewAnimation();

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    setSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    if (search) {
      setSearchParams({ search }, { replace: true });
    } else if (searchParams.get("search")) {
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const { data: response, isLoading } = useContracts({
    search: search || undefined,
    status: statusFilter,
  });

  const contracts: Contract[] = response?.data ?? [];

  return (
    <div ref={ref} className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        <h1 className="text-2xl font-medium text-foreground">Contracts</h1>
        <Link
          to="/dashboard/contracts/new"
          className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all shadow-sm"
        >
          New Contract <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Filters */}
      <div className={`bg-white rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.15s" }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[hsl(230,25%,96%)] border-0 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <select
          value={statusFilter ?? ""}
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground border border-[hsl(230,20%,90%)] rounded-full px-4 py-2 bg-transparent hover:bg-[hsl(230,25%,96%)] transition-colors appearance-none cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="in_review">In Review</option>
          <option value="completed">Completed</option>
          <option value="disputed">Disputed</option>
        </select>
        <div className="flex bg-[hsl(230,25%,94%)] rounded-full p-0.5">
          <button onClick={() => setView("grid")} className={`p-2 rounded-full transition-colors ${view === "grid" ? "bg-white shadow-sm" : ""}`}>
            <LayoutGrid size={16} className="text-muted-foreground" />
          </button>
          <button onClick={() => setView("list")} className={`p-2 rounded-full transition-colors ${view === "list" ? "bg-white shadow-sm" : ""}`}>
            <List size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-4" />
              <div className="h-5 bg-muted rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2 mb-4" />
              <div className="h-1.5 bg-muted rounded-full mb-3" />
              <div className="h-6 bg-muted rounded w-1/4 ml-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && contracts.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-muted-foreground">No contracts found</p>
          <Link
            to="/dashboard/contracts/new"
            className="inline-flex items-center gap-2 mt-4 bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-emerald-600 transition-colors"
          >
            Create your first contract <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {/* Grid */}
      {!isLoading && contracts.length > 0 && view === "grid" && (
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
                  <span className={`w-2 h-2 rounded-full ${statusColors[c.status]}`} />
                  <span className="text-xs font-medium text-muted-foreground">{statusLabels[c.status]}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal size={18} className="text-muted-foreground" />
                </button>
              </div>

              <h3 className="text-base font-medium text-foreground mb-2">{c.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-medium text-emerald-700">
                  {getContractorInitials(c)}
                </div>
                <span className="text-xs text-muted-foreground">
                  {getContractorLabel(c)}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground/60">Progress</span>
                  <span className="text-[10px] text-muted-foreground/60">{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-[hsl(230,25%,94%)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${c.progress}%` }} />
                </div>
              </div>

              <p className="text-xl font-semibold text-foreground text-right">{formatAmount(c.total_amount)}</p>
            </Link>
          ))}
        </div>
      )}

      {/* List */}
      {!isLoading && contracts.length > 0 && view === "list" && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {contracts.map((c, i) => (
            <Link
              key={c.id}
              to={`/dashboard/contracts/${c.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-[hsl(230,25%,97%)] transition-colors ${i < contracts.length - 1 ? "border-b border-[hsl(230,20%,94%)]" : ""}`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[c.status]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{getContractorLabel(c)}</p>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">{statusLabels[c.status]}</span>
              <div className="w-24 hidden md:block">
                <div className="h-1.5 bg-[hsl(230,25%,94%)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground">{formatAmount(c.total_amount)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContractsList;
