import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import AesEncryption from "@/utils/AesEncryption";
import API from "@/server/API";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  site: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  // Configure one or more authentication providers
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
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
      async authorize(credentials: any, req: any) {
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
          console.log("data:", data);

          if (!data?.access_token) {
            console.log("failed");
            return NextResponse.redirect("/login");
          } else {
            const accessToken = AesEncryption.aes_encrypt(data?.access_token);
            await cookies().set("AccessToken", accessToken, {
              maxAge: 86400,
            });

            console.log("success");
            return {
              id: credentials?.id,
              email: credentials?.id,
            };
          }
        } catch (e) {
          console.log("error:", e);
          return NextResponse.redirect("/login");
        }
      },
    }),
  ],

  callbacks: {
    async jwt(
      token: any,
      user: any,
      account: any,
      profile: any,
      isNewUser: any
    ) {
      console.log("account:", account);
      console.log("token:", token);
      if (token.account.provider === "credentials") {
        if (token.user.email) {
          return token;
        }
      } else if (token.account.provider === "kakao") {
        // social login
        const social_id = token?.user?.id;
        const img = token?.user?.image;
        const name = token?.user?.name;
        console.log("social_id:", social_id, "img:", img, "name:", name);
        const { data } = await axios.get(
          `${process.env.BASE_URL}${API.SOCIAL_CHECK(social_id)}`
        );
        console.log("isNew?:", data);

        if (data?.isNew) {
          const { data: signupData } = await axios.post(
            `${process.env.BASE_URL}${API.SOCIAL_SIGNUP}`,
            {
              social_id: social_id,
              img: img,
              name: name,
            }
          );
          if (!signupData?.access_token) {
            console.log("failed");
            return NextResponse.redirect("/login");
          } else {
            const accessToken = AesEncryption.aes_encrypt(
              signupData?.access_token
            );
            await cookies().set("AccessToken", accessToken, {
              maxAge: 86400,
            });

            return token;
          }
        } else if (data?.isNew === false) {
          const { data: loginData } = await axios.get(
            `${process.env.BASE_URL}${API.SOCIAL_LOGIN(social_id)}`
          );
          if (!loginData?.access_token) {
            console.log("failed");
            return NextResponse.redirect("/login");
          } else {
            const accessToken = AesEncryption.aes_encrypt(
              loginData?.access_token
            );
            await cookies().set("AccessToken", accessToken, {
              maxAge: 86400,
            });

            return token;
          }
        }
      }
    },

    async session({ session, token }) {
      console.log("session&token:", token);
      // 세션 객체에 토큰의 정보를 추가하여 클라이언트에서도 이용 가능하도록 함
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.provider = token.provider;
      }
      return session;
    },
  },
};
