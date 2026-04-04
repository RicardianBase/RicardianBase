import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { requestNonce, verifySignature } from "@/api/auth";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getStoredUser,
  setStoredUser,
  clearAuth,
} from "@/lib/auth";
import type { AuthUser } from "@/types/api";

const BASE_CHAIN_ID = "0x2105"; // Base Mainnet (8453)
const BASE_CHAIN_CONFIG = {
  chainId: BASE_CHAIN_ID,
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

type WalletProviderType = "phantom" | "metamask" | "coinbase";

interface WalletState {
  address: string | null;
  provider: WalletProviderType | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  connect: (provider: WalletProviderType) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | null>(null);

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};

async function switchToBase(ethProvider: any) {
  try {
    await ethProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_CHAIN_ID }],
    });
  } catch (err: any) {
    // 4902 = chain not added yet
    if (err.code === 4902) {
      await ethProvider.request({
        method: "wallet_addEthereumChain",
        params: [BASE_CHAIN_CONFIG],
      });
    } else {
      throw err;
    }
  }
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<"phantom" | "metamask" | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Rehydrate auth state from localStorage on mount
  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
      setAddress(storedUser.walletAddress);
    }
    setIsLoading(false);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const connect = useCallback(async (p: WalletProviderType) => {
    try {
      let walletAddress: string;
      let ethProvider: any;

      // Step 1: Get the EVM provider and connect
      if (p === "phantom") {
        ethProvider = (window as any).phantom?.ethereum;
        if (!ethProvider) {
          window.open("https://phantom.app/", "_blank");
          return;
        }
        const accounts = await ethProvider.request({
          method: "eth_requestAccounts",
        });
        if (!accounts?.[0]) return;
        walletAddress = accounts[0];
      } else if (p === "coinbase") {
        ethProvider =
          (window as any).coinbaseWalletExtension ||
          ((window as any).ethereum?.isCoinbaseWallet
            ? (window as any).ethereum
            : null);
        if (!ethProvider) {
          window.open("https://www.coinbase.com/wallet/downloads", "_blank");
          return;
        }
        const accounts = await ethProvider.request({
          method: "eth_requestAccounts",
        });
        if (!accounts?.[0]) return;
        walletAddress = accounts[0];
      } else {
        ethProvider = (window as any).ethereum;
        if (!ethProvider?.isMetaMask) {
          window.open("https://metamask.io/download/", "_blank");
          return;
        }
        const accounts = await ethProvider.request({
          method: "eth_requestAccounts",
        });
        if (!accounts?.[0]) return;
        walletAddress = accounts[0];
      }

      // Step 2: Switch to Base chain
      await switchToBase(ethProvider);

      // Step 3: Request nonce from backend
      const { message } = await requestNonce(walletAddress, p);

      // Step 4: Sign the message (EVM personal_sign for both wallets)
      const signature: string = await ethProvider.request({
        method: "personal_sign",
        params: [message, walletAddress],
      });

      // Step 5: Verify with backend, get JWT
      const authResponse = await verifySignature(walletAddress, signature, p);

      // Step 6: Store tokens and user state
      setAccessToken(authResponse.accessToken);
      setRefreshToken(authResponse.refreshToken);
      setStoredUser(authResponse.user);
      setAddress(walletAddress);
      setProvider(p);
      setUser(authResponse.user);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    clearAuth();
    setAddress(null);
    setProvider(null);
    setUser(null);
    window.location.href = "/";
  }, []);

  const isAuthenticated = !!user && !!getAccessToken();

  return (
    <WalletContext.Provider
      value={{
        address,
        provider,
        isConnected: !!address,
        isAuthenticated,
        isLoading,
        user,
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
