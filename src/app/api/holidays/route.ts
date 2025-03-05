import { NextResponse } from "next/server";
import { getKoreanHolidays } from "@/utils/holidayUtils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");

  if (!yearParam) {
    return NextResponse.json(
      { error: "Year parameter is required" },
      { status: 400 }
    );
  }

  const year = parseInt(yearParam);

  try {
    const holidays = await getKoreanHolidays(year);
    return NextResponse.json(holidays);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return NextResponse.json(
      { error: "Failed to fetch holidays" },
      { status: 500 }
    );
  }
}
