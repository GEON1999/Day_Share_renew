import axios from "axios";
import { NextResponse } from "next/server";
import API from "@/server/API";
import rqOption from "@/server/rqOption";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: any,
  res: { params: { id?: string; todoId?: string } }
) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (accessToken === undefined) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  const id = res.params.id;
  const todoId = res.params.todoId;
  if (!id || !todoId) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  try {
    const data = await axios.post(
      `${process.env.BASE_URL}${API.TOGGLE_TODO_COMPLETE(id, todoId)}`,
      {},
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
