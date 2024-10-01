import { withAuth } from "next-auth/middleware";
import { cookies } from "next/headers";

export default withAuth({
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ token, req }) {
      const authorization =
        req.headers.get("Authorization") === process.env.NEXT_SSR_SECRET_KEY;
      if (token || authorization) {
        if (!cookies()?.get("AccessToken")) {
          return false;
        }
        return true;
      }
      return !!token;
    },
  },
});
