import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target, type } = body;

    if (!target) {
      return NextResponse.json(
        { error: "Target is required" },
        { status: 400 }
      );
    }

    if (type && !["quick", "full", "custom"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid scan type. Must be 'quick', 'full', or 'custom'" },
        { status: 400 }
      );
    }

    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const scanType = type || "quick";

    const estimatedDurations: Record<string, string> = {
      quick: "5-8 minutes",
      full: "15-25 minutes",
      custom: "10-15 minutes",
    };

    return NextResponse.json({
      scanId,
      message: `Scan initiated against ${target} using ${scanType} scan profile. Estimated duration: ${estimatedDurations[scanType]}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
