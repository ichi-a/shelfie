import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

<meta name="apple-mobile-web-app-title" content="Shelfie" />


export const metadata: Metadata = {
  title: "Shelfie",
  description: "AIによる推薦機能を搭載した読書記録＆支援アプリ。評価やコメントを残して本棚に記録して自分専用の司書AIが次の本を提案してくれます。",
  // manifest: "@/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`bg-[#F5F3EF]`}
      >
        {children}
        <Footer />
        <Toaster position="top-center" richColors/>
      </body>
    </html>
  );
}
