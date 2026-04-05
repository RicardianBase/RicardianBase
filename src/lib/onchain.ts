// On-chain helpers for Base mainnet (chain 8453)
// Uses raw eth_call via public RPC — no viem/ethers dependency needed.

const BASE_RPC = "https://mainnet.base.org";

// USDC on Base
export const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const USDC_DECIMALS = 6;

// PYUSD on Base (Paxos USD)
export const PYUSD_BASE = "0xCfC37A6AB183dd4aED08C204D1c2773c0b1BDf46";
export const PYUSD_DECIMALS = 6;

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
}

export const BASE_TOKENS: TokenInfo[] = [
  { address: USDC_BASE, symbol: "USDC", decimals: USDC_DECIMALS },
  { address: PYUSD_BASE, symbol: "PYUSD", decimals: PYUSD_DECIMALS },
];

// ABI encoding: balanceOf(address) selector = 0x70a08231
function encodeBalanceOf(address: string): string {
  const addr = address.toLowerCase().replace("0x", "").padStart(64, "0");
  return `0x70a08231${addr}`;
}

// ABI encoding: transfer(address,uint256) selector = 0xa9059cbb
export function encodeTransfer(to: string, amount: bigint): string {
  const selector = "0xa9059cbb";
  const toParam = to.toLowerCase().replace("0x", "").padStart(64, "0");
  const amountParam = amount.toString(16).padStart(64, "0");
  return selector + toParam + amountParam;
}

export function toRawAmount(amount: number, decimals: number): bigint {
  // Multiply by 10^decimals while avoiding floating-point drift
  const [whole, frac = ""] = amount.toString().split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole + fracPadded);
}

export function fromRawAmount(raw: bigint, decimals: number): number {
  return Number(raw) / 10 ** decimals;
}

async function ethCall(to: string, data: string): Promise<string> {
  const res = await fetch(BASE_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to, data }, "latest"],
    }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || "RPC error");
  return json.result as string;
}

export async function getTokenBalance(
  walletAddress: string,
  token: TokenInfo,
): Promise<number> {
  if (!walletAddress) return 0;
  const data = encodeBalanceOf(walletAddress);
  const result = await ethCall(token.address, data);
  const raw = BigInt(result || "0x0");
  return fromRawAmount(raw, token.decimals);
}

export async function getAllBalances(
  walletAddress: string,
): Promise<{ token: string; balance: number }[]> {
  if (!walletAddress) return BASE_TOKENS.map((t) => ({ token: t.symbol, balance: 0 }));
  const balances = await Promise.all(
    BASE_TOKENS.map(async (t) => ({
      token: t.symbol,
      balance: await getTokenBalance(walletAddress, t).catch(() => 0),
    })),
  );
  return balances;
}

// Send ERC-20 token via the connected wallet provider
export async function sendToken(
  ethProvider: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> },
  from: string,
  token: TokenInfo,
  to: string,
  amount: number,
): Promise<string> {
  const raw = toRawAmount(amount, token.decimals);
  const data = encodeTransfer(to, raw);
  const txHash = (await ethProvider.request({
    method: "eth_sendTransaction",
    params: [{ from, to: token.address, data }],
  })) as string;
  return txHash;
}
