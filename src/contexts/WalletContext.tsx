import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface WalletState {
  address: string | null;
  provider: "phantom" | "metamask" | null;
  isConnected: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  connect: (provider: "phantom" | "metamask") => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | null>(null);

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<"phantom" | "metamask" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const connect = useCallback(async (p: "phantom" | "metamask") => {
    try {
      if (p === "phantom") {
        const solana = (window as any).solana;
        if (!solana?.isPhantom) {
          window.open("https://phantom.app/", "_blank");
          return;
        }
        const resp = await solana.connect();
        setAddress(resp.publicKey.toString());
        setProvider("phantom");
      } else {
        const ethereum = (window as any).ethereum;
        if (!ethereum?.isMetaMask) {
          window.open("https://metamask.io/download/", "_blank");
          return;
        }
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts?.[0]) {
          setAddress(accounts[0]);
          setProvider("metamask");
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setProvider(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        provider,
        isConnected: !!address,
        isModalOpen,
        openModal,
        closeModal,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
