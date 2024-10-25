import type { Metadata } from "next";
import "@/css/style.css";
import Providers from "@/app/Providers";
import AuthSession from "@/app/AuthSession";
import { Noto_Serif_KR } from "next/font/google";

// Google Fonts에서 원하는 폰트를 불러옵니다.

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Day Share",
  description: "소중한 기록을 함께",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSerif.className} font-[300]`}>
        <AuthSession>
          <Providers>{children}</Providers>
        </AuthSession>
      </body>
    </html>
  );
}
