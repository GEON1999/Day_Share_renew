"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SessionCheck() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleSessionError = useCallback(() => {
    const publicPaths = ["/login", "/signup", "/"];
    if (publicPaths.includes(pathname)) {
      return;
    }

    if (session?.error === "RefreshAccessTokenError") {
      // 리프레시 토큰 만료 시 처리
      signOut({
        callbackUrl: `/login?error=session_expired&redirect=${encodeURIComponent(
          pathname
        )}`,
        redirect: true,
      });
    } else if (
      session?.error === "AccessTokenExpired" &&
      session?.user?.isAuto === "false"
    ) {
      // 일반 액세스 토큰 만료 처리
      signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    }
  }, [session, pathname]);

  useEffect(() => {
    handleSessionError();
  }, [handleSessionError]);

  return null;
}
