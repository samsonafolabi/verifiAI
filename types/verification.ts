type Source = "provided" | "default";
type Dex = "uniswap_v3";

interface IntentMetadata {
  slippageSource: Source;
  dexSource: Source;
  normalizations: string[];
}

interface ParsedIntent {
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

type ParseResult = Success | Failure;
