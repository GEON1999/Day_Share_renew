import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async authorized({ token, req }: { token: any; req: any }) {
      // const publicPaths = ["/signup", "/api/signup", "/api/imageUpload"];
      // const pathname = req.nextUrl.pathname;

      // // if (token?.error === "RefreshAccessTokenError") {
      // //   if (!publicPaths.includes(pathname)) {
      // //     NextResponse.redirect(new URL("/login", req.url));
      // //     return false;
      // //   }
      // // }

      // // if (
      // //   token?.error === "AccessTokenExpired" &&
      // //   token?.user?.isAuto === "false"
      // // ) {
      // //   if (!publicPaths.includes(pathname)) {
      // //     NextResponse.redirect(new URL("/login", req.url));
      // //     return false;
      // //   }
      // // }

      // if (publicPaths.includes(pathname)) {
      //   return true;
      // }

      // const authorization = req.headers.get("Authorization");
      // if (authorization === process.env.NEXT_SSR_SECRET_KEY) {
      //   return true;
      // }
      // if (token) {
      //   return true;
      // }
      // return false;
      return true;
    },
  },
});
