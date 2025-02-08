import type { Metadata } from "next";
import "@/css/style.css";
import Providers from "@/app/Providers";
import AuthSession from "@/app/AuthSession";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import withTheme from "./ConfigProvider";
import localFont from "next/font/local";
import { AlertProvider } from "@/components/alert/AlertContext";
import Alert from "@/components/alert/Alert";

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

const gowunDodum = localFont({
  src: "../../public/fonts/GowunDodum-Regular.ttf",
  display: "swap",
  preload: true,
  variable: "--font-gowun-dodum",
});

export const metadata: Metadata = {
  title: "Day Share",
  description: "소중한 기록을 함께",
  openGraph: {
    title: "Day Share",
    description: "소중한 기록을 함께",
    url: "https://day-share.vercel.app/",
    siteName: "Day Share",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Day Share 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Day Share",
    description: "소중한 기록을 함께",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return withTheme(
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="/antd.min.css" />
      </head>
      <body
        className={`${gowunDodum.className} ${notoSans.variable} ${notoSerif.variable} ${gowunDodum.variable} text-default border-default`}
      >
        <AuthSession>
          <Providers>
            <AlertProvider>
              <Alert />
              {children}
            </AlertProvider>
          </Providers>
        </AuthSession>
      </body>
    </html>
  );
}
