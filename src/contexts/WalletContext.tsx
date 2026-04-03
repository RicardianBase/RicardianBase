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

interface WalletState {
  address: string | null;
  provider: "phantom" | "metamask" | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
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

  const connect = useCallback(async (p: "phantom" | "metamask") => {
    try {
      let walletAddress: string;

      // Step 1: Connect wallet to get address
      if (p === "phantom") {
        const solana = (window as any).solana;
        if (!solana?.isPhantom) {
          window.open("https://phantom.app/", "_blank");
          return;
        }
        const resp = await solana.connect();
        walletAddress = resp.publicKey.toString();
      } else {
        const ethereum = (window as any).ethereum;
        if (!ethereum?.isMetaMask) {
          window.open("https://metamask.io/download/", "_blank");
          return;
        }
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        if (!accounts?.[0]) return;
        walletAddress = accounts[0];
      }

      // Step 2: Request nonce from backend
      const { message } = await requestNonce(walletAddress, p);

      // Step 3: Sign the message with wallet
      let signature: string;
      if (p === "phantom") {
        const encoded = new TextEncoder().encode(message);
        const signed = await (window as any).solana.signMessage(
          encoded,
          "utf8"
        );
        // Convert Uint8Array signature to base58
        const bs58Chars =
          "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        const bytes = signed.signature as Uint8Array;
        let num = BigInt(0);
        for (const byte of bytes) {
          num = num * BigInt(256) + BigInt(byte);
        }
        signature = "";
        while (num > BigInt(0)) {
          const remainder = Number(num % BigInt(58));
          num = num / BigInt(58);
          signature = bs58Chars[remainder] + signature;
        }
        // Handle leading zeros
        for (const byte of bytes) {
          if (byte === 0) {
            signature = "1" + signature;
          } else {
            break;
          }
        }
      } else {
        signature = await (window as any).ethereum.request({
          method: "personal_sign",
          params: [message, walletAddress],
        });
      }

      // Step 4: Verify with backend, get JWT
      const authResponse = await verifySignature(walletAddress, signature, p);

      // Step 5: Store tokens and user state
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
