import { z } from "zod";
import { callGemini } from "../llm/gemini";
import type { ParsedIntent, ParseResult } from "@/types/verification";

// Zod schema for validation
const IntentMetadataSchema = z.object({
  slippageSource: z.enum(["provided", "default"]),
  dexSource: z.enum(["provided", "default"]),
  normalizations: z.array(z.string()),
});

const ParsedIntentSchema = z.object({
  fromToken: z.string(),
  fromAmount: z.string(),
  toToken: z.string(),
  slippagePercent: z.number(),
  dex: z.literal("uniswap_v3"),
  metadata: IntentMetadataSchema,
});

const SYSTEM_PROMPT = `You are a blockchain swap intent parser for VerifAI.

Your job is to extract swap transaction details from natural language and return structured JSON.

EXTRACT THESE FIELDS:
- fromToken: Token being sold (symbol)
- fromAmount: Amount being sold (as string for precision)
- toToken: Token being bought (symbol)
- slippagePercent: Maximum slippage tolerance (as number)
- dex: Decentralized exchange (always "uniswap_v3" for now)
- metadata: Object tracking what was provided vs assumed

RULES:
1. Normalize "ETH" or "Ethereum" to "WETH" (Wrapped ETH)
2. Track normalizations in metadata.normalizations array
3. If slippage not mentioned: use 0.5, set metadata.slippageSource = "default"
4. If slippage mentioned: set metadata.slippageSource = "provided"
5. If DEX not mentioned: use "uniswap_v3", set metadata.dexSource = "default"
6. If DEX mentioned: set metadata.dexSource = "provided"
7. SUPPORTED TOKENS: USDC, USDT, DAI, WETH, ETH (normalize ETH→WETH)
8. Return fromAmount as STRING (e.g., "500")
9. Return ONLY valid JSON - no markdown, no backticks

ERROR HANDLING:
If invalid, return: {"error": "Invalid swap intent"}

EXAMPLES:

Input: "Swap 500 USDC for ETH"
{"fromToken":"USDC","fromAmount":"500","toToken":"WETH","slippagePercent":0.5,"dex":"uniswap_v3","metadata":{"slippageSource":"default","dexSource":"default","normalizations":["ETH → WETH"]}}

Input: "Swap 1000 USDT for WETH with 2% slippage"
{"fromToken":"USDT","fromAmount":"1000","toToken":"WETH","slippagePercent":2,"dex":"uniswap_v3","metadata":{"slippageSource":"provided","dexSource":"default","normalizations":[]}}

Now parse this:`;

export async function parseIntent(intent: string): Promise<ParseResult> {
  try {
    // 1. Build the full prompt
    const fullPrompt = `${SYSTEM_PROMPT}\n${intent}`;

    // 2. Call Gemini
    const response = await callGemini(fullPrompt);

    // 3. Clean the response (remove markdown if Gemini adds it)
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    }
    if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "");
    }

    // 4. Parse JSON
    const parsed = JSON.parse(cleanedResponse);

    // 5. Check for error response from LLM
    if (parsed.error) {
      return {
        success: false,
        error: parsed.error,
      };
    }

    // 6. Validate with Zod
    const validated = ParsedIntentSchema.parse(parsed);

    // 7. Return success
    return {
      success: true,
      data: validated as ParsedIntent,
    };
  } catch (error) {
    // Handle any errors (JSON parse fails, Zod validation fails, etc.)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to parse intent",
    };
  }
}
