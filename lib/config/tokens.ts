import type { SupportedChain } from "./chains";

export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
}

export const TOKENS: Record<SupportedChain, Record<string, TokenInfo>> = {
  ethereum: {
    USDC: {
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
    },
    USDT: {
      symbol: "USDT",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
    },
    DAI: {
      symbol: "DAI",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
    },
    WETH: {
      symbol: "WETH",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
    },
  },
  base: {
    USDC: {
      symbol: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
    },
    USDT: {
      symbol: "USDT",
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      decimals: 6,
    },
    DAI: {
      symbol: "DAI",
      address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      decimals: 18,
    },
    WETH: {
      symbol: "WETH",
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
    },
  },
};

export function getTokenInfo(
  chain: SupportedChain,
  symbol: string,
): TokenInfo | null {
  return TOKENS[chain][symbol] || null;
}

export function getTokenSymbol(
  chain: SupportedChain,
  address: string,
): string | null {
  const tokens = TOKENS[chain];
  const entry = Object.entries(tokens).find(
    ([_, info]) => info.address.toLowerCase() === address.toLowerCase(),
  );
  return entry ? entry[0] : null;
}
