import { NextResponse } from "next/server";
import { NextApiResponse } from "next";
import axios from "axios";
import API from "@/server/API";

export async function POST(req: any, response: NextApiResponse) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    const data = await axios.post(
      `${process.env.BASE_URL}${API.UPLOAD_IMAGE}`,
      formDataToSend,
      {
        headers: {
          secret: process.env.IMAGE_UPLOAD_SECRET,
          accept: "application/json",
          "Content-Type": "multipart/form-data",
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
