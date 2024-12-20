import type { Metadata } from "next";
import "@/css/style.css";
import Providers from "@/app/Providers";
import AuthSession from "@/app/AuthSession";
import { Gowun_Dodum, Noto_Sans, Noto_Serif } from "next/font/google";
import SessionCheck from "./SessionCheck";

// Google Fonts에서 원하는 폰트를 불러옵니다.

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  variable: "--font-noto-sans",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  variable: "--font-noto-serif",
});

const dodum = Gowun_Dodum({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dodum",
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
      <body
        className={`${dodum.className} ${notoSans.variable} ${notoSerif.variable} font-[300]`}
      >
        <AuthSession>
          <Providers>
            <SessionCheck />
            {children}
          </Providers>
        </AuthSession>
      </body>
    </html>
  );
}
