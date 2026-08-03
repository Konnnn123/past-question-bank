import type { Metadata } from "next";
import FrameworkLearningClient from "../FrameworkLearningClient";

export const metadata: Metadata = { title: "Track A 单体建筑分析 | 専門2-2 建築史" };
export default function BuildingTrackPage() { return <FrameworkLearningClient mode="building" />; }
