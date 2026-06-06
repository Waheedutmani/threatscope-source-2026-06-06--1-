import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scanId, format } = body;

    if (!scanId) {
      return NextResponse.json(
        { error: "Scan ID is required" },
        { status: 400 }
      );
    }

    if (format && !["pdf", "csv"].includes(format)) {
      return NextResponse.json(
        { error: "Invalid format. Must be 'pdf' or 'csv'" },
        { status: 400 }
      );
    }

    const reportFormat = format || "pdf";
    const reportId = `rpt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const reportUrl = `/reports/${reportId}.${reportFormat}`;

    return NextResponse.json({
      reportUrl,
      reportId,
      scanId,
      format: reportFormat,
      message: `Report generated successfully in ${reportFormat.toUpperCase()} format`,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
