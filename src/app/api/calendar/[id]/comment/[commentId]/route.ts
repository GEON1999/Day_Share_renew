import axios from "axios";
import { NextResponse } from "next/server";
import API from "@/server/API";
import rqOption from "@/server/rqOption";
import { cookies } from "next/headers";
import AesEncryption from "@/utils/AesEncryption";

export async function POST(
  req: any,
  res: { params: { id?: string; todoId?: string } }
) {
  const encryptedAccessToken = cookies().get("AccessToken");
  const accessToken = AesEncryption.aes_decrypt(encryptedAccessToken);

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
  const body = await req.json();

  try {
    const data = await axios.post(
      `${process.env.BASE_URL}${API.UPDATE_COMMENT(id, todoId)}`,
      body,
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
