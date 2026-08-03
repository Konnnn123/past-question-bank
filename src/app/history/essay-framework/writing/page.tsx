import type { Metadata } from "next";
import FrameworkLearningClient from "../FrameworkLearningClient";

export const metadata: Metadata = { title: "论述工作台 | 専門2-2 建築史" };
export default function WritingWorkbenchPage() { return <FrameworkLearningClient mode="writing" />; }
