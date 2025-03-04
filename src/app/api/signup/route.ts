import axios from "axios";
import { NextResponse } from "next/server";
import API from "@/server/API";

export async function POST(req: any) {
  const body = await req.json();

  try {
    const data = await axios.post(`${process.env.BASE_URL}${API.SIGNUP}`, body);

    return NextResponse.json(data.data, { status: 200 });
  } catch (error) {
    console.error("API call error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
