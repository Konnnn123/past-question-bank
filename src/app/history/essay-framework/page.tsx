import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import EssayFrameworkClient from "./EssayFrameworkClient";

export const metadata: Metadata = {
  title: "専門2-2 建築史論述フレーム | 建筑考试学习中心",
  description: "从题型判断、单体建筑分析、主题论述到建筑技术史的専門2-2学习框架。",
};

export default function EssayFrameworkPage() {
  const recallProfilesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/specialist-2-2-recall-profiles.json"), "utf-8"));
  const recallPoolData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/specialist-2-2-recall-case-pool.json"), "utf-8"));
  const imageMap = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/building-image-map.json"), "utf-8"));
  const readyCases = new Map(
    recallPoolData.cases
      .filter((item: { role: string; recallProfile?: { status?: string } }) => item.role === "anchor" && item.recallProfile?.status === "ready")
      .map((item: { id: string }) => [item.id, item])
  );
  const chainMap = new Map(recallPoolData.chains.map((chain: { id: string }) => [chain.id, chain]));
  const recallProfiles = recallProfilesData.profiles
    .filter((profile: { buildingId: string }) => readyCases.has(profile.buildingId))
    .map((profile: { buildingId: string }) => {
      const poolCase = readyCases.get(profile.buildingId) as {
        chainIds: string[];
        examRefs: Array<{ year: number; question: string; relation: string }>;
      };
      return {
        ...profile,
        imageFile: imageMap[profile.buildingId]?.imageFiles?.[0] ?? null,
        examRefs: poolCase.examRefs,
        themes: poolCase.chainIds.map((id) => chainMap.get(id)).filter(Boolean),
      };
    });

  return <EssayFrameworkClient recallProfiles={recallProfiles} />;
}
