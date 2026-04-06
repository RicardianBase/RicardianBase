import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight, ArrowDownLeft, Download, Send, ExternalLink,
  Copy, Check, Wallet as WalletIcon, RefreshCw,
} from "lucide-react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { useTransactions } from "@/hooks/api/useWallet";
import { useWallet } from "@/contexts/WalletContext";
import { getAllBalances } from "@/lib/onchain";
import SendTokenModal from "@/components/dashboard/SendTokenModal";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const Wallet = () => {
  const { ref, isInView } = useInViewAnimation();
  const { address } = useWallet();
  const { data: txResponse, isLoading: txLoading } = useTransactions();
  const [sendModal, setSendModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: onchainBalances, isLoading: balancesLoading, refetch } = useQuery({
    queryKey: ["wallet", "onchain-balances", address],
    queryFn: () => getAllBalances(address ?? ""),
    enabled: !!address,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const transactions = txResponse?.data ?? [];
  const usdcBalance = onchainBalances?.[0]?.balance ?? 0;
  const truncatedAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    if (!transactions.length) return;
    const header = ["Date", "Type", "Direction", "Amount", "Currency", "Description", "Tx Hash", "Status"];
    const rows = transactions.map((t) => [
      new Date(t.created_at).toISOString(), t.type, t.direction, t.amount, t.currency,
      t.description ?? "", t.tx_hash ?? "", t.status,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={ref} className="space-y-6 max-w-4xl">
      {/* Hero balance section */}
      <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.1s" }}>
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 px-8 pt-8 pb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <WalletIcon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Total Balance</p>
                <p className="text-white/80 text-xs font-mono mt-0.5">Base Network</p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Refresh balance"
            >
              <RefreshCw size={14} className="text-white/70" />
            </button>
          </div>

          {balancesLoading ? (
            <div className="h-12 w-48 bg-white/15 animate-pulse rounded-lg" />
          ) : (
            <p className="text-5xl font-semibold text-white tracking-tight">
              ${usdcBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
          <p className="text-white/50 text-sm mt-2">USDC</p>
        </div>

        {/* Wallet address + Actions row */}
        <div className="px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[hsl(230,20%,94%)]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground bg-[hsl(230,25%,96%)] px-3 py-1.5 rounded-lg hover:bg-[hsl(230,25%,93%)] transition-colors"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              {copied ? "Copied!" : truncatedAddr}
            </button>
            <a
              href={`https://basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink size={12} /> Basescan
            </a>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSendModal(true)}
              className="inline-flex items-center gap-2 text-sm font-medium bg-emerald-500 text-white px-5 py-2.5 rounded-full hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              <Send size={14} /> Send USDC
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className={`bg-white rounded-2xl shadow-sm ${isInView ? "animate-fade-in-up" : ""}`} style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(230,20%,94%)]">
          <h2 className="text-sm font-semibold text-foreground">Transaction History</h2>
          {transactions.length > 0 && (
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download size={13} /> Export CSV
            </button>
          )}
        </div>

        {txLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[hsl(230,25%,94%)] flex items-center justify-center mx-auto mb-3">
              <WalletIcon size={20} className="text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Transactions from contracts and transfers will appear here</p>
          </div>
        ) : (
          <div>
            {transactions.map((t, i) => (
              <div
                key={t.id}
                className={`flex items-center gap-3 px-6 py-4 hover:bg-[hsl(230,25%,97.5%)] transition-colors ${
                  i < transactions.length - 1 ? "border-b border-[hsl(230,20%,95%)]" : ""
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  t.direction === "in" ? "bg-emerald-50" : "bg-red-50"
                }`}>
                  {t.direction === "in"
                    ? <ArrowDownLeft size={16} className="text-emerald-600" />
                    : <ArrowUpRight size={16} className="text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate capitalize">
                    {t.description ?? t.type.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(t.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${t.direction === "in" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.direction === "in" ? "+" : "-"}${parseFloat(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  {t.tx_hash && (
                    <a
                      href={`https://basescan.org/tx/${t.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground/50 font-mono inline-flex items-center gap-0.5 hover:text-emerald-600 transition-colors"
                    >
                      {t.tx_hash.slice(0, 6)}...{t.tx_hash.slice(-4)} <ExternalLink size={9} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SendTokenModal
        open={sendModal}
        onClose={() => setSendModal(false)}
        defaultToken="USDC"
        title="Send USDC"
      />
    </div>
  );
};

export default Wallet;
