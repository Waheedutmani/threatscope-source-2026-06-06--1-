import { NextResponse } from "next/server";
import { vulnerabilities } from "@/lib/mock-data";

export async function GET() {
  try {
    const summary = {
      critical: vulnerabilities.filter((v) => v.severity === "critical").length,
      high: vulnerabilities.filter((v) => v.severity === "high").length,
      medium: vulnerabilities.filter((v) => v.severity === "medium").length,
      low: vulnerabilities.filter((v) => v.severity === "low").length,
      info: vulnerabilities.filter((v) => v.severity === "info").length,
    };

    const byCategory = vulnerabilities.reduce(
      (acc, v) => {
        acc[v.category] = (acc[v.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byStatus = {
      open: vulnerabilities.filter((v) => v.status === "open").length,
      in_progress: vulnerabilities.filter((v) => v.status === "in_progress").length,
      resolved: vulnerabilities.filter((v) => v.status === "resolved").length,
      accepted: vulnerabilities.filter((v) => v.status === "accepted").length,
    };

    return NextResponse.json({
      vulnerabilities,
      total: vulnerabilities.length,
      summary,
      byCategory,
      byStatus,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve vulnerability data" },
      { status: 500 }
    );
  }
}
