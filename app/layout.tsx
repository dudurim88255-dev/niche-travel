import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#FF6B35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://niche-travel.app"
  ),
  title: "나만의 여행",
  description: "남들이 안 가는 곳, 진짜 일상에 닿는 여행",
  applicationName: "나만의여행",
  appleWebApp: {
    capable: true,
    title: "나만의여행",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
  formatDetection: {
    telephone: false,
  },
  // Next 16 metadata API는 mobile-web-app-capable만 출력 (Chromium 신규 권고).
  // iOS Safari는 여전히 apple-mobile-web-app-capable로만 인식하므로 raw로 추가.
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
