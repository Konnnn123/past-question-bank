import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "建築学 過去問データベース",
  description: "東京大学大学院 建築学専攻 修士課程 過去問データベース",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="h-screen overflow-hidden font-sans">{children}</body>
    </html>
  );
}
