import { NextResponse } from "next/server";
import {
  cveEntries,
  threatCategories,
  threatTrends,
  threatNewsItems,
  iocData,
} from "@/lib/mock-data";

export async function GET() {
  try {
    return NextResponse.json({
      cves: cveEntries,
      categories: threatCategories,
      trends: threatTrends,
      news: threatNewsItems,
      iocs: iocData,
      lastUpdated: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve threat intelligence data" },
      { status: 500 }
    );
  }
}
