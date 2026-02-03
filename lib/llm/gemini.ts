import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 4. Export the function
export async function callGemini(prompt: string): Promise<string> {
  // Send the prompt to Gemini
  const result = await model.generateContent(prompt);

  // Get the response
  const response = await result.response;

  // Extract the text
  const text = response.text();

  // Return it
  return text;
}
