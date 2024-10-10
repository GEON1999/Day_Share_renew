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
      async authorize(credentials: any) {
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
    async jwt({ token, user, account }: any) {
      // 첫 로그인 시 사용자 정보가 존재할 때 token에 추가
      if (account && user) {
        token.id = user.id || user.sub || null;
        token.email = user.email || null;
        token.provider = account.provider;
      }

      // Kakao 로그인 시 token 쿠키 저장 로직 유지
      if (account?.provider === "kakao" && user) {
        const social_id = user.id;
        const img = user.image;
        const name = user.name;
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
          if (signupData?.access_token) {
            const accessToken = AesEncryption.aes_encrypt(
              signupData.access_token
            );
            await cookies().set("AccessToken", accessToken, {
              maxAge: 86400,
            });
          }
        } else if (data?.isNew === false) {
          const { data: loginData } = await axios.get(
            `${process.env.BASE_URL}${API.SOCIAL_LOGIN(social_id)}`
          );
          if (loginData?.access_token) {
            const accessToken = AesEncryption.aes_encrypt(
              loginData.access_token
            );
            await cookies().set("AccessToken", accessToken, {
              maxAge: 86400,
            });
          }
        }
      }

      // 이후 토큰 호출 시에도 정보를 유지
      return token;
    },

    async session({ session, token }: any) {
      // 세션 콜백에서 token의 정보를 세션에 추가
      session.user.id = token.id;
      session.user.email = token.email;
      session.provider = token.provider;

      return session;
    },
  },
};
