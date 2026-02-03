import "dotenv/config";
import { parseIntent } from "./parseIntent";

async function test() {
  console.log("Testing parser...\n");

  // Test 1: Simple swap with ETH normalization
  const test1 = await parseIntent("Swap 500 USDC for ETH");
  console.log("Test 1 - Swap 500 USDC for ETH:");
  console.log(JSON.stringify(test1, null, 2));
  console.log("\n---\n");

  //   // Test 2: With slippage specified
  //   const test2 = await parseIntent("Swap 1000 USDT for WETH with 2% slippage");
  //   console.log("Test 2 - With slippage:");
  //   console.log(JSON.stringify(test2, null, 2));
  //   console.log("\n---\n");

  //   // Test 3: Invalid input
  //   const test3 = await parseIntent("hello world");
  //   console.log("Test 3 - Invalid input:");
  //   console.log(JSON.stringify(test3, null, 2));
}

test();
