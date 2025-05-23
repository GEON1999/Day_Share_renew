import axios from "axios";
import { NextResponse } from "next/server";
import API from "@/server/API";
import rqOption from "@/server/rqOption";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 사용할지 미정
export async function GET(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (accessToken === undefined) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  try {
    const data = await axios.get(
      `${process.env.BASE_URL}${API.GET_CALENDAR_SELECT_LIST}`,
      rqOption.apiHeader(accessToken)
    );

    return NextResponse.json(data.data, { status: 200 });
  } catch (error) {
    console.error("API call error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
