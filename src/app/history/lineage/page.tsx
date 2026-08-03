import type { Metadata } from "next";
import JapaneseLineageClient from "./JapaneseLineageClient";
import { JAPANESE_PERSON_LINEAGES } from "@/lib/japanese-person-lineages";
import { JAPANESE_LINEAGE_CASE_STUDIES } from "@/lib/japanese-lineage-case-studies";

export const metadata: Metadata = {
  title: "日本建築史・人物谱系",
  description: "日本古代から近世の人物、家族関係、造営役割を建築と結んで学ぶ谱系図。",
};

export default function JapaneseLineagePage() {
  return <JapaneseLineageClient lineages={JAPANESE_PERSON_LINEAGES} caseStudies={JAPANESE_LINEAGE_CASE_STUDIES} />;
}
