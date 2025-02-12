import axios from "axios";
import { NextResponse } from "next/server";
import API from "@/server/API";
import rqOption from "@/server/rqOption";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET(req: any, res: { params: { chatId?: string } }) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (accessToken === undefined) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  const chatId = res.params.chatId;
  if (!chatId) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  try {
    const data = await axios.get(
      `${process.env.BASE_URL}${API.GET_CHAT_MESSAGES(chatId)}`,
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
