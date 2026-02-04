import { NextResponse } from "next/server";
import { parseIntent } from "@/lib/parser/parseIntent";

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { intent } = body;

    // 2. Validate input
    if (!intent || typeof intent !== "string") {
      return NextResponse.json(
        { error: "Intent is required and must be a string" },
        { status: 400 },
      );
    }

    // 3. Parse the intent
    const result = await parseIntent(intent);

    // 4. Return result
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    // 5. Handle unexpected errors
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
