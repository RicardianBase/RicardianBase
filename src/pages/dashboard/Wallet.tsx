import { ArrowUpRight, ArrowDownLeft, Download, CircleDollarSign } from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useWalletBalances, useTransactions } from "@/hooks/api/useWallet";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const Wallet = () => {
  const { ref, isInView } = useInViewAnimation();
  const { data: balances, isLoading: balancesLoading } = useWalletBalances();
  const { data: txResponse, isLoading: txLoading } = useTransactions();

  const transactions = txResponse?.data ?? [];

  const balanceCards = balances?.map((b) => ({
    token: b.token,
    balance: `$${parseFloat(b.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    icon: b.token === "USDC" ? "💲" : "🅿️",
    gradient: b.token === "USDC" ? "from-emerald-500 to-emerald-700" : "from-emerald-600 to-emerald-800",
  })) ?? [
    { token: "USDC", balance: "$0.00", icon: "💲", gradient: "from-emerald-500 to-emerald-700" },
    { token: "PYUSD", balance: "$0.00", icon: "🅿️", gradient: "from-emerald-600 to-emerald-800" },
  ];

  return (
    <div ref={ref} className="space-y-6">
      <h1 className={`text-2xl font-medium text-foreground ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        Wallet
      </h1>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {balanceCards.map((b, i) => (
          <div
            key={b.token}
            className={`bg-gradient-to-br ${b.gradient} rounded-2xl p-6 shadow-lg ${isInView ? "animate-fade-in-up" : ""}`}
            style={{ animationDelay: `${0.15 + i * 0.05}s` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-lg">
                {b.icon}
              </div>
              <span className="text-sm font-medium text-white/80">{b.token}</span>
            </div>
            {balancesLoading ? (
              <div className="h-9 w-32 bg-white/20 animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-semibold text-white">{b.balance}</p>
            )}
            <p className="text-xs text-white/60 mt-1">Available balance</p>
            <div className="flex gap-2 mt-5">
              <button className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-foreground px-4 py-2 rounded-full hover:bg-white/90 transition-colors">
                <CircleDollarSign size={14} /> Fund
              </button>
              <button className="inline-flex items-center gap-1.5 text-xs font-medium border border-white/30 text-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-foreground">Transactions</h2>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium border border-[hsl(230,20%,90%)] text-muted-foreground px-4 py-2 rounded-full hover:bg-[hsl(230,25%,96%)] transition-colors">
            <Download size={14} /> Export
          </button>
        </div>

        {txLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3.5">
                <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-0">
            {transactions.map((t, i) => (
              <div key={t.id} className={`flex items-center gap-3 py-3.5 ${i < transactions.length - 1 ? "border-b border-[hsl(230,20%,94%)]" : ""}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  t.direction === "in" ? "bg-[hsl(160,40%,92%)]" : "bg-[hsl(340,40%,94%)]"
                }`}>
                  {t.direction === "in"
                    ? <ArrowDownLeft size={16} className="text-[hsl(160,50%,40%)]" />
                    : <ArrowUpRight size={16} className="text-[hsl(340,60%,50%)]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground truncate">{t.description ?? t.type.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{formatDate(t.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-medium ${t.direction === "in" ? "text-[hsl(160,50%,40%)]" : "text-[hsl(340,60%,50%)]"}`}>
                    {t.direction === "in" ? "+" : "-"}${parseFloat(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  {t.tx_hash && (
                    <span className="text-[10px] text-muted-foreground/60 font-mono inline-flex items-center gap-0.5">
                      {t.tx_hash.slice(0, 6)}...{t.tx_hash.slice(-4)} <ArrowUpRight size={10} />
                    </span>
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

export default Wallet;
