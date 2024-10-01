import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import AesEncryption from "@/utils/AesEncryption";
import API from "@/server/API";
export const authOptions = {
  site: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req) {
        const formData = new URLSearchParams();
        formData.append("username", credentials?.id);
        formData.append("password", credentials?.password);
        try {
          const { data } = await axios.post(
            `${process.env.BASE_URL}${API.LOGIN}`,
            formData,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (!data?.access_token) {
            console.log("failed");
            return NextResponse.redirect("/login");
          } else {
            const accessToken = AesEncryption.aes_encrypt(data?.access_token);
            await cookies().set("AccessToken", accessToken, {
              maxAge: 86400,
            });

            const cookiesData = cookies().get("AccessToken");
            return {
              id: credentials?.id,
              email: credentials?.id,
            };
          }
        } catch (e) {
          return NextResponse.redirect("/login");
        }
      },
    }),
  ],
};
