import type { Metadata } from "next";
import FrameworkLearningClient from "../FrameworkLearningClient";

export const metadata: Metadata = {
  title: "过去问适配审计 | 専門2-2 建築史",
  description: "以2014—2026年24道専門2-2建筑史过去问检验论述框架的考场适配范围。",
};

export default function EssayFrameworkAuditPage() {
  return <FrameworkLearningClient mode="audit" />;
}
