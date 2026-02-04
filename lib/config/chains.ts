export type ChainId = 1 | 8453; // Ethereum mainnet | Base mainnet

export type SupportedChain = "ethereum" | "base";

export const CHAIN_IDS: Record<SupportedChain, ChainId> = {
  ethereum: 1,
  base: 8453,
};

export const CHAIN_NAMES: Record<ChainId, SupportedChain> = {
  1: "ethereum",
  8453: "base",
};
