import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpires?: number;
      isAuto?: string;
      provider?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    error?: string;
    redirect?: string;
    accessToken?: string;
    accessTokenExpires?: number;
    isAuto?: string;
    provider?: string;
  }
}
