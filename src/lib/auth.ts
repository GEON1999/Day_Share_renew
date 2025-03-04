import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextResponse } from "next/server";
import API from "@/server/API";
import KakaoProvider from "next-auth/providers/kakao";
import StaticKeys from "@/keys/StaticKeys";

// 전역 변수로 refresh promise와 마지막 갱신 토큰을 공유
let globalRefreshPromise: Promise<any> | null = null;
let lastRefreshedToken: any = null;

export const authOptions = {
  site: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
    signOut: "/login",
  },

  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: String(profile.id),
          isAuto: "false",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
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
            return {
              id: String(data.userId),
              email: credentials?.id,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expires_in: StaticKeys.ACCESS_TOKEN_EXPIRES / 1000,
              isAuto: credentials?.auto,
            };
          } else if (data?.access_token && !data?.refresh_token) {
            return {
              id: String(data.userId),
              email: credentials?.id,
              accessToken: data.access_token,
              expires_in: StaticKeys.ACCESS_TOKEN_EXPIRES / 1000,
              isAuto: credentials?.auto,
            };
          } else {
            return null;
          }
        } catch (e) {
          return NextResponse.redirect("/login");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }: any) {
      // 토큰 갱신 함수를 수정하여 전역 promise와 마지막 갱신 토큰을 활용
      async function refreshAccessToken(token: any) {
        if (globalRefreshPromise) return globalRefreshPromise;

        globalRefreshPromise = (async () => {
          try {
            const response = await axios.post(
              `${process.env.BASE_URL}/api/refresh`,
              { refresh_token: token.refreshToken }
            );

            const newToken = {
              ...token,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
              accessTokenExpires: Date.now() + StaticKeys.ACCESS_TOKEN_EXPIRES,
              user: {
                ...token.user,
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
              },
              // 갱신 시각 업데이트 (추후 비교용)
              iat: Date.now(),
            };
            // 전역에 최신 갱신 토큰 저장
            lastRefreshedToken = newToken;
            return newToken;
          } catch (error: any) {
            console.error("갱신 실패:", error.response?.status);
            if (error.response?.status === 401) {
              return {
                redirect: "/login",
                error: "RefreshTokenExpired",
                accessToken: null,
                refreshToken: null,
                accessTokenExpires: null,
              };
            }
            return token;
          } finally {
            globalRefreshPromise = null;
          }
        })();

        return globalRefreshPromise;
      }

      const timeNow = Date.now();

      if (account && user) {
        // 새 로그인 시 provider의 정보를 토큰에 업데이트
        token.accessToken = user.accessToken || token.accessToken;
        token.refreshToken = user.refreshToken || token.refreshToken;
        token.accessTokenExpires = Date.now() + StaticKeys.ACCESS_TOKEN_EXPIRES;
        token.user = user;
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
              token.accessToken = signupData.access_token;
              token.accessTokenExpires =
                Date.now() + StaticKeys.ACCESS_TOKEN_EXPIRES;
            }
          } else if (data?.isNew === false) {
            const { data: loginData } = await axios.get(
              `${process.env.BASE_URL}${API.SOCIAL_LOGIN(social_id)}`
            );
            if (loginData?.access_token) {
              token.accessToken = loginData.access_token;
              token.accessTokenExpires =
                Date.now() + StaticKeys.ACCESS_TOKEN_EXPIRES;
            }
          }
          return token;
        }

        return token;
      }

      // 이미 토큰이 유효한 경우 그대로 반환
      const shouldRefreshTime =
        token.accessTokenExpires - StaticKeys.TOKEN_REFRESH_THRESHOLD;
      if (timeNow < shouldRefreshTime) {
        return token;
      }

      // 자동 로그인인 경우 만료된 토큰에 대해 갱신
      if (token.isAuto === "true" && timeNow > token.accessTokenExpires) {
        // 만약 마지막 갱신 토큰이 있다면(이미 갱신된 새 토큰)
        if (
          lastRefreshedToken &&
          lastRefreshedToken.refreshToken !== token.refreshToken &&
          timeNow < lastRefreshedToken.accessTokenExpires
        ) {
          return lastRefreshedToken;
        }
        const refreshedToken = await refreshAccessToken(token);
        if (refreshedToken.error === "RefreshTokenExpired") {
          return {
            ...refreshedToken,
            user: { id: token.user?.id },
          };
        }
        return refreshedToken;
      }

      // 수동 로그인인 경우 만료되면 로그인 페이지로 리다이렉트
      if (token.isAuto === "false" && timeNow > token.accessTokenExpires) {
        return {
          redirect: "/login",
          error: "AccessTokenExpired",
          user: { id: token.user?.id },
        };
      }

      return token;
    },

    async session({ session, token }: any) {
      if (token.error === "RefreshTokenExpired") {
        return {
          ...session,
          error: token.error,
          redirect: token.redirect,
        };
      }

      if (!token) {
        return {
          ...session,
          error: "TokenNotFound",
        };
      }

      if (token.redirect) {
        return {
          redirect: token.redirect,
          error: token.error,
          isAuto: token.isAuto,
          user: token.user,
        };
      }

      session.user = {
        ...token.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpires: token.accessTokenExpires,
        isAuto: token.isAuto,
        provider: token.provider,
      };
      session.error = token.error;
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.isAuto = token.isAuto;
      session.provider = token.provider;

      return session;
    },
    pages: {
      signIn: "/login",
      signOut: "/login",
    },
  },
};
