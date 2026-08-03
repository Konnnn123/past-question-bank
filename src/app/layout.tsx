import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import ExploreLanguageProvider from "@/components/ExploreLanguageProvider";

export const metadata: Metadata = {
  title: "建筑考试学习中心",
  description: "以过去问为起点，连接知识探索、考试练习与复习反馈。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="h-screen overflow-hidden font-sans"><ExploreLanguageProvider>{children}</ExploreLanguageProvider></body>
    </html>
  );
}
