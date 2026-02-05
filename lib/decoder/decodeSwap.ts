import { decodeAbiParameters, parseAbiParameters } from "viem";
import type { SupportedChain } from "../config/chains";
import { getTokenSymbol } from "../config/tokens";

export interface DecodedSwap {
  tokenIn: {
    address: string;
    symbol: string | null;
  };
  tokenOut: {
    address: string;
    symbol: string | null;
  };
  fee: number;
  recipient: string;
  amountIn: string;
  amountOutMinimum: string;
  sqrtPriceLimitX96?: string;
}

export function decodeSwapCalldata(
  chain: SupportedChain,
  calldata: `0x${string}`,
): DecodedSwap | null {
  try {
    const selector = calldata.slice(0, 10);

    console.log("Function selector:", selector);

    // Check if this is a multicall
    if (selector === "0x5ae401dc" || selector === "0xac9650d8") {
      // Extract the actual swap calldata from multicall
      const swapCalldata = extractSwapFromMulticall(calldata);
      if (!swapCalldata) {
        console.error("Could not extract swap from multicall");
        return null;
      }
      // Recursively decode the extracted swap
      return decodeSwapCalldata(chain, swapCalldata);
    }

    const params = `0x${calldata.slice(10)}` as `0x${string}`;

    if (selector === "0x414bf389") {
      return decodeExactInput(chain, params);
    } else if (selector === "0x04e45aaf") {
      return decodeExactInputSingle(chain, params);
    }

    console.error("Unknown function selector:", selector);
    return null;
  } catch (error) {
    console.error("Error decoding calldata:", error);
    return null;
  }
}

function extractSwapFromMulticall(
  calldata: `0x${string}`,
): `0x${string}` | null {
  try {
    const data = calldata.slice(2);
    console.log("Full calldata length:", data.length);

    // Skip selector (8 chars)
    let offset = 8;

    // Skip deadline (64 chars)
    console.log("Deadline:", data.slice(offset, offset + 64));
    offset += 64;

    // Read offset to data array (64 chars)
    const arrayOffsetHex = data.slice(offset, offset + 64);
    console.log("Array offset hex:", arrayOffsetHex);
    const arrayOffset = parseInt(arrayOffsetHex, 16) * 2;
    console.log("Array offset:", arrayOffset);
    offset += 64;

    // Jump to array data
    offset = 8 + arrayOffset; // 8 for selector
    console.log("Jumping to offset:", offset);

    // Read array length
    const arrayLengthHex = data.slice(offset, offset + 64);
    console.log("Array length hex:", arrayLengthHex);
    const arrayLength = parseInt(arrayLengthHex, 16);
    console.log("Array length:", arrayLength);
    offset += 64;

    if (arrayLength === 0) {
      console.log("Array is empty");
      return null;
    }

    // Read offset to first element
    const firstElementOffsetHex = data.slice(offset, offset + 64);
    console.log("First element offset hex:", firstElementOffsetHex);
    const firstElementOffset = parseInt(firstElementOffsetHex, 16) * 2;
    console.log("First element offset:", firstElementOffset);

    // Jump to first element (relative to start of array data)
    const elementStart = 8 + arrayOffset + 64 + firstElementOffset;
    console.log("Element start position:", elementStart);

    // Read element length
    const elementLengthHex = data.slice(elementStart, elementStart + 64);
    console.log("Element length hex:", elementLengthHex);
    const elementLength = parseInt(elementLengthHex, 16) * 2;
    console.log("Element length:", elementLength);

    // Extract the actual calldata
    const innerCalldata = data.slice(
      elementStart + 64,
      elementStart + 64 + elementLength,
    );
    console.log("Inner calldata:", innerCalldata.slice(0, 100) + "...");
    console.log("Inner calldata length:", innerCalldata.length);

    return `0x${innerCalldata}` as `0x${string}`;
  } catch (error) {
    console.error("Error extracting from multicall:", error);
    return null;
  }
}

function decodeExactInputSingle(
  chain: SupportedChain,
  params: `0x${string}`,
): DecodedSwap | null {
  try {
    const decoded = decodeAbiParameters(
      parseAbiParameters([
        "address tokenIn",
        "address tokenOut",
        "uint24 fee",
        "address recipient",
        "uint256 amountIn",
        "uint256 amountOutMinimum",
        "uint160 sqrtPriceLimitX96",
      ]),
      params,
    );

    const [
      tokenIn,
      tokenOut,
      fee,
      recipient,
      amountIn,
      amountOutMinimum,
      sqrtPriceLimitX96,
    ] = decoded;

    return {
      tokenIn: {
        address: tokenIn,
        symbol: getTokenSymbol(chain, tokenIn),
      },
      tokenOut: {
        address: tokenOut,
        symbol: getTokenSymbol(chain, tokenOut),
      },
      fee: Number(fee),
      recipient,
      amountIn: amountIn.toString(),
      amountOutMinimum: amountOutMinimum.toString(),
      sqrtPriceLimitX96: sqrtPriceLimitX96.toString(),
    };
  } catch (error) {
    console.error("Error decoding exactInputSingle:", error);
    return null;
  }
}

function decodeExactInput(
  chain: SupportedChain,
  params: `0x${string}`,
): DecodedSwap | null {
  try {
    // This will be implemented properly once we see real exactInput calldata
    console.log("exactInput decoding not yet implemented");
    return null;
  } catch (error) {
    console.error("Error decoding exactInput:", error);
    return null;
  }
}
