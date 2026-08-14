import type { Metadata } from "next";
import TermCardsClient from "./TermCardsClient";

export const metadata: Metadata = {
  title: "用語カード｜建築試験学習センター",
  description: "自分のAI APIを使って、建築専門用語のカードを生成・整理・復習できます。",
};

export default function TermCardsPage() {
  return <TermCardsClient />;
}
