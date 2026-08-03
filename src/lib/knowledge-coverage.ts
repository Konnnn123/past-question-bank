import fs from "fs";
import path from "path";
import type { LightPracticeQuestion } from "@/lib/light-practice";
import { ENVIRONMENT_FORMULAS } from "@/lib/environment-knowledge";

type AnkiRecord = {
  source: { noteId: string; deck: string };
  name: string;
  fields: Record<string, string>;
  tags: string[];
  qualityFlags: string[];
};

export type KnowledgeCoverageItem = {
  id: string;
  name: string;
  subject: "建筑史";
  source: "Anki";
  deck: string;
  priority: number;
  status: "已有真题单元" | "只有记忆卡";
  suggestedForms: string[];
  needsReview: boolean;
};

export type SubjectCoverageItem = {
  id: string;
  name: string;
  subject: "建筑计划" | "建筑环境工学";
  source: string;
  group: string;
  status: "已有真题关联" | "只有知识材料";
  suggestedForms: string[];
  sourceYears?: number[];
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[\s・·.．,，&＆\-—―()（）\[\]【】「」『』]/g, "");
}

export function getAnkiKnowledgeCoverage(units: LightPracticeQuestion[]): KnowledgeCoverageItem[] {
  const sourcePath = path.resolve(process.cwd(), "data/anki-import/anki-notes.json");
  if (!fs.existsSync(sourcePath)) return [];
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf-8")) as { records: AnkiRecord[] };
  const corpus = normalize(units.filter((unit) => unit.subject === "建筑史").map((unit) => `${unit.prompt} ${unit.answer}`).join("\n"));
  return source.records.map((record) => {
    const key = normalize(record.name);
    const covered = key.length > 2 && corpus.includes(key);
    const priority = record.tags.find((tag) => tag.startsWith("重要度:"))?.split("⭐️").length ?? 1;
    const suggestedForms = ["图片识别"];
    if (record.fields.people?.trim()) suggestedForms.push("建筑师配对");
    if (record.fields.style?.trim()) suggestedForms.push("样式判断");
    if (record.fields.history?.trim()) suggestedForms.push("特征与背景简答");
    return {
      id: record.source.noteId,
      name: record.name,
      subject: "建筑史" as const,
      source: "Anki" as const,
      deck: record.source.deck,
      priority,
      status: covered ? "已有真题单元" as const : "只有记忆卡" as const,
      suggestedForms,
      needsReview: record.qualityFlags.length > 0,
    };
  }).sort((a, b) => Number(a.status === "已有真题单元") - Number(b.status === "已有真题单元") || b.priority - a.priority || a.name.localeCompare(b.name));
}

export function getPlanningKnowledgeCoverage(): SubjectCoverageItem[] {
  const sourcePath = path.resolve(process.cwd(), "data/planning-exam-card-index.json");
  if (!fs.existsSync(sourcePath)) return [];
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf-8")) as {
    cards: Array<{ id: string; name: string; type?: string; tags?: string[]; questionFormat?: string }>;
    links: Array<{ cardId: string }>;
  };
  const linked = new Set(source.links.map((link) => link.cardId));
  return source.cards.map((card) => {
    const forms = card.questionFormat ? [card.questionFormat] : [];
    if (card.tags?.includes("数值")) forms.push("数值判断／填空");
    if (card.tags?.includes("建筑") || card.tags?.includes("案例")) forms.push("案例识别／说明");
    if (!forms.length) forms.push("概念简答／选择");
    return { id: card.id, name: card.name, subject: "建筑计划" as const, source: "Notion知识卡索引", group: card.type || "未分类", status: linked.has(card.id) ? "已有真题关联" as const : "只有知识材料" as const, suggestedForms: [...new Set(forms)] };
  }).sort((a, b) => Number(a.status === "已有真题关联") - Number(b.status === "已有真题关联") || a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
}

export function getEnvironmentKnowledgeCoverage(units: LightPracticeQuestion[]): SubjectCoverageItem[] {
  const corpus = normalize(units.filter((unit) => unit.subject === "建筑环境工学").map((unit) => `${unit.prompt} ${unit.answer}`).join("\n"));
  return ENVIRONMENT_FORMULAS.map((formula, index) => {
    const titleKey = normalize(formula.title);
    const formulaTerms = normalize(formula.formula).split(/[=+\/]/).filter((value) => value.length > 3);
    const direct = (titleKey.length > 2 && corpus.includes(titleKey)) || formulaTerms.some((term) => corpus.includes(term));
    return { id: `environment-formula-${index + 1}`, name: formula.title, subject: "建筑环境工学" as const, source: "环境工学公式库", group: formula.topic, status: direct ? "已有真题关联" as const : "只有知识材料" as const, suggestedForms: [formula.use.includes("求め") || /流|量|温度|照度|dB/.test(formula.use) ? "计算／数值判断" : "公式选择／条件辨析"], sourceYears: formula.referenceYears };
  }).sort((a, b) => Number(a.status === "已有真题关联") - Number(b.status === "已有真题关联") || a.group.localeCompare(b.group));
}
