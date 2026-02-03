type Source = "provided" | "default";
type Dex = "uniswap_v3";

interface IntentMetadata {
  slippageSource: Source;
  dexSource: Source;
  normalizations: string[];
}

export interface ParsedIntent {
  fromToken: string;
  fromAmount: string;
  toToken: string;
  slippagePercent: number;
  dex: Dex;

  metadata: IntentMetadata;
}

type Success = {
  success: true;
  data: ParsedIntent;
};
type Failure = {
  success: false;
  error: string;
};

export type ParseResult = Success | Failure;
