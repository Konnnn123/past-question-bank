import type { Metadata } from "next";
import SelfAssessmentClient from "./SelfAssessmentClient";

export const metadata: Metadata = {
  title: "9月1日考前计划 | 建筑考试学习中心",
  description: "整合一个月学习计划、每日执行记录、每周复盘与各科能力自评。",
};

export default function SelfAssessmentPage() {
  return <SelfAssessmentClient />;
}
