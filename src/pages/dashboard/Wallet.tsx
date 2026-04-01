import { ArrowUpRight, ArrowDownLeft, Download, CircleDollarSign } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const transactions = [
  { type: "in", desc: "Escrow funded — Brand Redesign", amount: "+$5,000.00", date: "Jan 15, 2026", hash: "0x3a1b...9c2d" },
  { type: "out", desc: "Milestone 2 released — API Suite", amount: "-$3,000.00", date: "Jan 14, 2026", hash: "0x7e4f...2a1b" },
  { type: "in", desc: "Escrow funded — Mobile App", amount: "+$10,000.00", date: "Jan 12, 2026", hash: "0x5c8d...4e3f" },
  { type: "out", desc: "Milestone 1 released — Brand Redesign", amount: "-$2,500.00", date: "Jan 10, 2026", hash: "0x9f2a...7b6c" },
  { type: "in", desc: "Deposit from external wallet", amount: "+$20,000.00", date: "Jan 8, 2026", hash: "0x1d4e...8a5b" },
];

const Wallet = () => {
  const { ref, isInView } = useInViewAnimation();

  return (
    <div ref={ref} className="space-y-6">
      <h1 className={`text-2xl font-medium text-gray-900 ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        Wallet
      </h1>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { token: "USDC", balance: "$42,500.00", icon: "💲" },
          { token: "PYUSD", balance: "$12,800.00", icon: "🅿️" },
        ].map((b, i) => (
          <div
            key={b.token}
            className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: `${0.15 + i * 0.05}s` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                {b.icon}
              </div>
              <span className="text-sm font-medium text-gray-500">{b.token}</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">{b.balance}</p>
            <p className="text-xs text-gray-400 mt-1">Available balance</p>
            <div className="flex gap-2 mt-5">
              <button className="inline-flex items-center gap-1.5 text-xs font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                <CircleDollarSign size={14} /> Fund
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-gray-900">Transactions</h2>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors">
            <Download size={14} /> Export
          </button>
        </div>

        <div className="space-y-0">
          {transactions.map((t, i) => (
            <div key={i} className={`flex items-center gap-3 py-3.5 ${i < transactions.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                t.type === "in" ? "bg-emerald-50" : "bg-red-50"
              }`}>
                {t.type === "in"
                  ? <ArrowDownLeft size={16} className="text-emerald-600" />
                  : <ArrowUpRight size={16} className="text-red-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{t.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-medium ${t.type === "in" ? "text-emerald-600" : "text-red-500"}`}>
                  {t.amount}
                </p>
                <a href="#" className="text-[10px] text-gray-400 font-mono hover:text-blue-500 inline-flex items-center gap-0.5">
                  {t.hash} <ArrowUpRight size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
