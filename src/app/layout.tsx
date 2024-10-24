import type { Metadata } from "next";
import "@/css/style.css";
import Providers from "@/app/Providers";
import AuthSession from "@/app/AuthSession";
import { Noto_Sans, Hi_Melody, Gaegu, Noto_Serif_KR } from "next/font/google";

// Google Fonts에서 원하는 폰트를 불러옵니다.
const notoSans = Noto_Sans({
  subsets: ["latin"], // 원하는 서브셋 선택
  weight: ["400", "700"], // 사용할 폰트 굵기 선택
});

const hiMelody = Hi_Melody({
  subsets: ["latin"], // 원하는 서브셋 선택
  weight: ["400"], // 사용할 폰트 굵기 선택
});

const gaegu = Gaegu({
  subsets: ["latin"], // 원하는 서브셋 선택
  weight: ["400", "700", "300"], // 사용할 폰트 굵기 선택
});

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
