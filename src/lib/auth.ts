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
    signOut: "/login",
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
        formData.append("auto", credentials.auto);
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

          if (data?.access_token && data?.refresh_token) {
            const accessToken = AesEncryption.aes_encrypt(data.access_token);
            const refreshToken = AesEncryption.aes_encrypt(data.refresh_token);

            await cookies().set("AccessToken", accessToken, {
              maxAge: 86400,
            });

            await cookies().set("RefreshToken", refreshToken, {
              maxAge: 604800,
            });
            return {
              id: credentials?.id,
              email: credentials?.id,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expires_in: 86400,
              isAuto: credentials?.auto,
            };
          } else if (data?.access_token && !data?.refresh_token) {
            const accessToken = AesEncryption.aes_encrypt(data.access_token);
            await cookies().set("AccessToken", accessToken, {
              maxAge: 86400,
            });
            await cookies().set("RefreshToken", "", {
              maxAge: 0,
            });
            return {
              id: credentials?.id,
              email: credentials?.id,
              accessToken: data.access_token,
              expires_in: 86400,
              isAuto: credentials?.auto,
            };
          } else {
            return null;
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
      async function refreshAccessToken(token: any) {
        try {
          const response = await axios.post(
            `${process.env.BASE_URL}/api/refresh`,
            {
              refresh_token: token.refreshToken,
            }
          );
          const refreshedTokens = response.data;
          if (!refreshedTokens.access_token) {
            throw new Error(
              "리프레시 토큰으로 새로운 액세스 토큰을 받지 못했습니다."
            );
          }

          const accessToken = AesEncryption.aes_encrypt(
            response.data.access_token
          );
          await cookies().set("AccessToken", accessToken, {
            maxAge: 86400,
          });

          return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + 86400 * 1000,
            refreshToken: refreshedTokens.refresh_token || token.refreshToken,
          };
        } catch (error) {
          console.error("액세스 토큰 갱신 오류:", error);
          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
        }
      }

      if (account && user) {
        token.accessToken = user.accessToken || token.accessToken;
        token.refreshToken = user.refreshToken || token.refreshToken;
        (token.accessTokenExpires = Date.now() + 86400 * 1000),
          (token.user = user);
        token.provider = account.provider;
        token.isAuto = user.isAuto;

        // Kakao 로그인 시 추가 처리
        if (account.provider === "kakao") {
          const social_id = user.id;
          const img = user.image;
          const name = user.name;
          const { data } = await axios.get(
            `${process.env.BASE_URL}${API.SOCIAL_CHECK(social_id)}`
          );

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

        return token;
      }
      const timeNow = Date.now();
      const shouldRefreshTime = token.accessTokenExpires - 43200 * 1000;

      if (timeNow < shouldRefreshTime) {
        return token;
      }

      if (token.isAuto === "true") {
        try {
          const refreshedToken = await refreshAccessToken(token);
          return refreshedToken;
        } catch (error: any) {
          if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
          ) {
            cookies().delete("AccessToken");
            cookies().delete("RefreshToken");
            return {
              ...token,
              accessToken: null,
              refreshToken: null,
              accessTokenExpires: null,
              error: "RefreshTokenExpired",
              destroy: true,
            };
          }

          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
        }
      } else if (
        token.isAuto === "false" &&
        timeNow > token.accessTokenExpires
      ) {
        return {
          ...token,
          error: "AccessTokenExpired",
        };
      }
    },

    async session({ session, token }: any) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.provider = token.provider;
      return session;
    },
  },
};
