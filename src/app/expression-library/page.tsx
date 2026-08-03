import type { Metadata } from "next";
import ExpressionLibraryClient from "./ExpressionLibraryClient";

export const metadata: Metadata = {
  title: "建筑日语表达 Library",
  description: "日本建筑学修士入试可直接使用的高频日语句型卡片。",
};

export default function ExpressionLibraryPage() {
  return <ExpressionLibraryClient />;
}

