import type { Metadata } from "next";
import FrameworkLearningClient from "../FrameworkLearningClient";

export const metadata: Metadata = { title: "建筑技术史 T×M×O | 専門2-2 建築史" };
export default function TechnologyHistoryPage() { return <FrameworkLearningClient mode="technology" />; }
