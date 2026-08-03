import type { Metadata } from "next";
import FrameworkLearningClient from "../FrameworkLearningClient";

export const metadata: Metadata = { title: "Track B 主题论述 | 専門2-2 建築史" };
export default function ThematicTrackPage() { return <FrameworkLearningClient mode="thematic" />; }
