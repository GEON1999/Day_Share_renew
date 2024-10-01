import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import AesEncryption from "@/utils/AesEncryption";
import { NextApiResponse } from "next";
import axios from "axios";
import API from "@/server/API";

export async function POST(req: any, response: NextApiResponse) {
  const encryptedAccessToken = cookies().get("AccessToken");
  const accessToken = AesEncryption.aes_decrypt(encryptedAccessToken);

  if (accessToken === undefined) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  console.log("file :", file);
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);
    console.log("formData :", formDataToSend);

    const data = await axios.post(
      `${process.env.BASE_URL}${API.UPLOAD_IMAGE}`,
      formDataToSend,
      {
        headers: {
          secret: process.env.IMAGE_UPLOAD_SECRET,
          accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(data.data, { status: 200 });
  } catch (error) {
    //console.error("API call error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
