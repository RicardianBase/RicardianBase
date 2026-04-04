import { useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import phantomLogo from "@/assets/phantom-logo.jpg";
import metamaskLogo from "@/assets/metamask-logo.png";
import coinbaseLogo from "@/assets/coinbase-wallet-logo.webp";
import gsap from "gsap";

const wallets = [
  {
    id: "metamask" as const,
    name: "MetaMask",
    desc: "Connect using MetaMask browser extension",
    logo: metamaskLogo,
    tag: "Base",
  },
  {
    id: "phantom" as const,
    name: "Phantom",
    desc: "Connect using Phantom browser extension",
    logo: phantomLogo,
    tag: "Base",
  },
  {
    id: "coinbase" as const,
    name: "Coinbase Wallet",
    desc: "Self-custody wallet by Coinbase",
    logo: coinbaseLogo,
    tag: "Base",
  },
];

const ConnectWalletModal = () => {
  const { isModalOpen, closeModal, connect } = useWallet();
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.5)", delay: 0.05 }
      );
    });

    return () => ctx.revert();
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    gsap.to(panelRef.current, {
      opacity: 0, scale: 0.95, y: 10, duration: 0.2,
      onComplete: closeModal,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 className="text-lg font-medium text-foreground">Connect Wallet</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose a wallet to connect to Ricardian
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Wallet options */}
        <div className="p-6 pt-4 space-y-3">
          {wallets.map((w, i) => (
            <button
              key={w.id}
              onClick={() => connect(w.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-secondary/40 hover:border-[hsl(140,38%,38%)]/30 transition-all duration-200 group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border/50">
                <img src={w.logo} alt={w.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{w.name}</span>
                  <span className="text-[10px] font-medium bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                    {w.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{w.desc}</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground/40 group-hover:text-[hsl(140,38%,38%)] transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="rounded-xl bg-secondary/50 border border-border/50 p-3 flex items-start gap-2">
            <span className="text-xs text-muted-foreground leading-relaxed">
              By connecting a wallet, you agree to Ricardian's{" "}
              <a href="#" className="underline hover:text-foreground transition-colors">Terms</a> and{" "}
              <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
