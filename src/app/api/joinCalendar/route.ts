import axios from "axios";
import { NextResponse } from "next/server";
import API from "@/server/API";
import rqOption from "@/server/rqOption";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (accessToken === undefined) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  const queries = `${req.nextUrl.searchParams.toString()}`;

  try {
    const data = await axios.post(
      `${process.env.BASE_URL}${API.JOIN_CALENDAR(queries)}`,
      {},
      rqOption.apiHeader(accessToken)
    );

    return NextResponse.json(data.data, { status: 200 });
  } catch (error: any) {
    console.error("API call error:", error?.response?.data);
    return NextResponse.json(
      { message: error?.response?.data?.detail?.message },
      { status: 500 }
    );
  }
}
