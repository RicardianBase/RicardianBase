import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { BASE_TOKENS, sendToken, type TokenInfo } from "@/lib/onchain";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultToken?: string;
  defaultTo?: string;
  title?: string;
  onSuccess?: (txHash: string) => void;
}

const SendTokenModal = ({ open, onClose, defaultToken = "USDC", defaultTo = "", title = "Send Tokens", onSuccess }: Props) => {
  const { address, getEthProvider } = useWallet();
  const [tokenSymbol, setTokenSymbol] = useState(defaultToken);
  const [toAddress, setToAddress] = useState(defaultTo);
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!open) return null;

  const token: TokenInfo = BASE_TOKENS.find((t) => t.symbol === tokenSymbol) ?? BASE_TOKENS[0];

  const handleSend = async () => {
    setError(null);
    const provider = getEthProvider();
    if (!provider) {
      setError("No wallet provider found. Please reconnect your wallet.");
      return;
    }
    if (!address) {
      setError("Wallet not connected");
      return;
    }
    if (!toAddress || !/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
      setError("Enter a valid recipient address (0x...)");
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setSending(true);
    try {
      const hash = await sendToken(provider, address, token, toAddress, amt);
      setTxHash(hash);
      onSuccess?.(hash);
    } catch (e: any) {
      setError(e?.message ?? "Transaction failed");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setToAddress(defaultTo);
    setAmount("");
    setError(null);
    setTxHash(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 className="text-lg font-medium text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Send on Base mainnet</p>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {txHash ? (
          <div className="p-6 pt-4 space-y-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-sm font-medium text-emerald-700">Transaction sent!</p>
              <p className="text-xs text-emerald-600 mt-1 font-mono break-all">{txHash}</p>
            </div>
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm font-medium bg-emerald-500 text-white px-4 py-2.5 rounded-full hover:bg-emerald-600 transition-colors"
            >
              View on Basescan
            </a>
            <button onClick={handleClose} className="block w-full text-sm text-muted-foreground py-2 hover:text-foreground">
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 pt-4 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Token</label>
              <select
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {BASE_TOKENS.map((t) => (
                  <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Recipient Address</label>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="0x..."
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium bg-emerald-500 text-white px-4 py-2.5 rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {sending ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : "Send"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendTokenModal;
