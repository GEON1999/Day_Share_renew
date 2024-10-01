import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import AesEncryption from "@/utils/AesEncryption";
import { NextApiResponse } from "next";
import rqOption from "@/server/rqOption";
import axios from "axios";
import API from "@/server/API";
import helper from "@/helper/Helper";

export async function POST(req: any, response: NextApiResponse) {
    const encryptedAccessToken = cookies().get("AccessToken");
    const accessToken = AesEncryption.aes_decrypt(encryptedAccessToken);

    if (accessToken === undefined) {
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 },
        );
    }

    const body = await req.json();

    try {
        const data = await axios.post(
            `${process.env.POD_BASE_URL}${API.CREATE_CAMPAIGN}?${helper.queryToString(body)}`,
            {},
            rqOption.apiHeader(accessToken),
        );

        return NextResponse.json(data.data, { status: 200 });
    } catch (error) {
        console.error("API call error:", error);
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 },
        );
    }
}
