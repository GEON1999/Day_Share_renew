import type { Metadata } from "next";
import "@/css/style.css";
import Providers from "@/app/Providers";
import AuthSession from "@/app/AuthSession";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import SessionCheck from "./SessionCheck";
import withTheme from "./ConfigProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
            <SessionCheck />
            <AlertProvider>
              <Alert />
              {children}
            </AlertProvider>
            <SpeedInsights />
          </Providers>
        </AuthSession>
      </body>
    </html>
  );
}
