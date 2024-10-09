import { withAuth } from "next-auth/middleware";
import { cookies } from "next/headers";

export default withAuth({
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ token, req }: { token: any; req: any }) {
      console.log("middleware token:", token);
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
