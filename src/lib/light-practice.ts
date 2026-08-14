import type { Question } from "@/types/question";
import { getHistoryPracticeQuestions, getHistoryReviewAnswer } from "@/lib/history-review";
import { ENVIRONMENT_REVIEW_RECORDS } from "@/lib/environment-review";
import type { PlanningAnswerRecord } from "@/lib/planning-review";
import type { ConstructionAnswerRecord } from "@/lib/construction-review";
import { expandConstructionPracticeItem } from "@/lib/construction-practice-items";
import { parseEmbeddedMultipleChoice } from "@/lib/practice-multiple-choice";

export type LightPracticeQuestion = {
  id: string;
  subject: "建筑史" | "建筑计划" | "建筑环境工学" | "建筑构法";
  year: number;
  category: string;
  label: string;
  prompt: string;
  answer: string;
  options?: string[];
  correctIndex?: number;
  sourceQuestionId?: string;
  sourceKind: "past-exam";
  assessmentForm: "配对" | "简答" | "计算" | "判断辨析" | "论述";
  skillLevel: "记忆" | "理解" | "应用" | "综合";
};

export function isTextOnlyPracticePrompt(prompt: string) {
  const text = prompt.replace(/図書館/g, "");
  if (/!\[[^\]]*\]\([^)]*\)|<img\b/i.test(text)) return false;
  if (/(?:次|下|上|左|右|以下|前頁|次頁)の(?:図|写真|画像|表)|(?:図|写真|画像|表)(?:中|内|の[A-Z0-9①-⑳]|に示|を示|を参照|を見|から読|から選|を用い)/u.test(text)) return false;
  if (/(?:簡単な|模式|概念|平面|断面|立面|配置|接続)?図(?:を用いて|を用い|で示|に表|を描|を書|示せ|示しなさい)|作図|図示|描画|スケッチ|グラフ(?:を描|で表)|線で結/u.test(text)) return false;
  return true;
}

function assessmentMeta(prompt: string, answer: string) {
  const text = `${prompt} ${answer}`;
  if (/(計算|算出|求め|=|W\/|m²|dB|ppm)/i.test(text)) return { assessmentForm: "计算" as const, skillLevel: "应用" as const };
  if (/(○|×|正し|誤り|適切|不適切)/.test(text)) return { assessmentForm: "判断辨析" as const, skillLevel: "理解" as const };
  if (/(説明|比較|論じ|図示|特徴.*背景)/.test(text)) return { assessmentForm: "论述" as const, skillLevel: "综合" as const };
  return { assessmentForm: "简答" as const, skillLevel: "理解" as const };
}

function unit(base: Omit<LightPracticeQuestion, "sourceKind" | "assessmentForm" | "skillLevel">, pairing = false): LightPracticeQuestion {
  const parsed = parseEmbeddedMultipleChoice(base.prompt, base.answer);
  return {
    ...base,
    ...(parsed ? { prompt: parsed.prompt, options: parsed.options, correctIndex: parsed.correctIndex } : {}),
    sourceKind: "past-exam",
    ...(pairing ? { assessmentForm: "配对" as const, skillLevel: "记忆" as const } : assessmentMeta(base.prompt, base.answer)),
  };
}

function numberedSegments(content: string) {
  const matches = [...content.matchAll(/^\s*[（(](\d{1,2})[）)]/gm)];
  if (matches.length < 2) return new Map<string, string>();
  return new Map(matches.map((match, index) => [
    `s${String(Number(match[1])).padStart(2, "0")}`,
    content.slice(match.index, matches[index + 1]?.index ?? content.length).trim(),
  ]));
}

function environmentSegments(content: string) {
  const parenthesized = [...content.matchAll(/^\s*[（(](\d{1,2})[）)]/gm)];
  const bare = [...content.matchAll(/^\s*\d{1,2}[)）]/gm)];
  const letters = [...content.matchAll(/^\s*[（(]([a-p])[）)]/gim)];
  const matches = letters.length > 1 ? letters : bare.length > 1 ? bare : parenthesized;
  if (matches.length < 2) return new Map<string, string>();
  return new Map(matches.map((match, index) => [
    `s${String(index + 1).padStart(2, "0")}`,
    content.slice(match.index, matches[index + 1]?.index ?? content.length).trim(),
  ]));
}

export function buildLightPracticeQuestions(
  questions: Question[],
  planningRecords: PlanningAnswerRecord[],
  constructionRecords: ConstructionAnswerRecord[],
) {
  const byFile = new Map(questions.map((question) => [question.fileName, question]));
  const result: LightPracticeQuestion[] = [];

  for (const question of getHistoryPracticeQuestions(questions)) {
    const review = getHistoryReviewAnswer(question.fileName);
    review?.pairings?.forEach((pairing, index) => result.push(unit({
      id: `light:history:${question.id}:pair-${index + 1}`,
      subject: "建筑史", year: question.year, category: question.category,
      label: `语群 ${index + 1}`,
      prompt: `「${pairing.term}」に対応する人物・様式・概念を答えなさい。`,
      answer: `${pairing.answer}${pairing.period ? `（${pairing.period}）` : ""}`,
      sourceQuestionId: question.id,
    }, true)));
    review?.examples?.forEach((example, index) => result.push(unit({
      id: `light:history:${question.id}:example-${index + 1}`,
      subject: "建筑史", year: question.year, category: question.category,
      label: example.title, prompt: `「${example.title}」について、主要な特徴と成立背景を説明しなさい。`, answer: example.answer,
      sourceQuestionId: question.id,
    })));
  }

  for (const record of planningRecords) {
    const question = byFile.get(record.fileName);
    if (!question) continue;
    const segments = numberedSegments(question.content);
    for (const item of record.items) {
      const key = item.itemId.slice(item.itemId.lastIndexOf("#") + 1);
      const prompt = segments.get(key);
      if (!prompt) continue;
      result.push(unit({ id: `light:planning:${item.itemId}`, subject: "建筑计划", year: question.year, category: question.category, label: key.toUpperCase(), prompt, answer: `${item.choice}：${item.answer}`, sourceQuestionId: question.id }));
    }
  }

  for (const record of ENVIRONMENT_REVIEW_RECORDS) {
    const question = byFile.get(record.fileName);
    if (!question) continue;
    const segments = environmentSegments(question.content);
    for (const item of record.subAnswers ?? []) for (const key of item.segmentKeys ?? []) {
      const prompt = segments.get(key);
      if (!prompt) continue;
      result.push(unit({ id: `light:environment:${question.id}:${key}`, subject: "建筑环境工学", year: question.year, category: question.category, label: item.label, prompt, answer: item.answer, sourceQuestionId: question.id }));
    }
  }

  for (const record of constructionRecords) {
    const question = byFile.get(record.fileName);
    if (!question || question.category !== "専門1") continue;
    if (!isTextOnlyPracticePrompt(question.content)) continue;
    for (const item of record.items) for (const practiceItem of expandConstructionPracticeItem(item, question.content)) {
      if (!practiceItem.prompt) continue;
      result.push(unit({
        id: `light:construction:${practiceItem.id}`, subject: "建筑构法", year: question.year, category: question.category,
        label: practiceItem.id.includes(":part-") ? `小問 ${practiceItem.id.split(":part-").at(-1)}` : item.itemId.slice(item.itemId.lastIndexOf("#") + 1).toUpperCase(),
        prompt: practiceItem.prompt, answer: practiceItem.answer, options: practiceItem.options,
        correctIndex: practiceItem.correctIndex, sourceQuestionId: question.id,
      }));
    }
  }
  return result.filter((question) => isTextOnlyPracticePrompt(question.prompt));
}
