import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async authorized({ token, req }: { token: any; req: any }) {
      const publicPaths = ["/signup", "/api/signup", "/api/imageUpload"];
      const pathname = req.nextUrl.pathname;

      if (token?.error === "RefreshAccessTokenError") {
        if (!publicPaths.includes(pathname)) {
          const response = NextResponse.redirect(new URL("/login", req.url));
          response.cookies.delete("next-auth.session-token");
          response.cookies.delete("AccessToken");
          response.cookies.delete("RefreshToken");
          return false;
        }
      }

      if (
        token?.error === "AccessTokenExpired" &&
        token?.user?.isAuto === "false"
      ) {
        if (!publicPaths.includes(pathname)) {
          const response = NextResponse.redirect(new URL("/login", req.url));
          response.cookies.delete("next-auth.session-token");
          response.cookies.delete("AccessToken");
          response.cookies.delete("RefreshToken");
          return false;
        }
      }

      if (publicPaths.includes(pathname)) {
        return true;
      }

      const authorization = req.headers.get("Authorization");
      if (authorization === process.env.NEXT_SSR_SECRET_KEY) {
        return true;
      }
      if (token) {
        return true;
      }
      return false;
    },
  },
});
