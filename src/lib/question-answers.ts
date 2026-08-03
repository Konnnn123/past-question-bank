import fs from "fs";
import path from "path";
import type {
  AnswerReliability,
  QuestionAnswerItem,
  QuestionAnswerRecord,
} from "@/types/question-answer";

type RawAnswerItem = {
  itemId: string;
  prompt?: string;
  choice?: string;
  answer: string;
  explanation?: string;
  drawingPoints?: string[];
  reviewStatus: string;
};

type RawAnswerRecord = { fileName: string; items?: RawAnswerItem[] };

function reliabilityFor(status: string): AnswerReliability {
  if (status === "card-supported-draft" || status === "historical-law-draft") {
    return "source-supported";
  }
  if (status === "image-source-unresolved") return "questionable";
  return "ai-draft";
}

function loadRecords(fileName: string): RawAnswerRecord[] {
  const filePath = path.resolve(process.cwd(), "data", fileName);
  if (!fs.existsSync(filePath)) return [];
  const value = JSON.parse(fs.readFileSync(filePath, "utf8")) as {
    records?: RawAnswerRecord[];
  };
  return value.records ?? [];
}

function normalize(
  record: RawAnswerRecord,
  subject: QuestionAnswerRecord["subject"],
): QuestionAnswerRecord {
  return {
    fileName: record.fileName,
    subject,
    items: (record.items ?? []).map(
      (item): QuestionAnswerItem => ({
        itemId: item.itemId,
        prompt: item.prompt,
        choice: item.choice,
        answer: item.answer,
        explanation: item.explanation,
        drawingPoints: item.drawingPoints,
        sourceStatus: item.reviewStatus,
        reliability: reliabilityFor(item.reviewStatus),
      }),
    ),
  };
}

export function getQuestionAnswerRecord(
  questionFileName: string,
): QuestionAnswerRecord | undefined {
  const planning = loadRecords("planning-exam-answers.json").find(
    (record) => record.fileName === questionFileName,
  );
  if (planning) return normalize(planning, "planning");

  const construction = loadRecords("construction-exam-answers.json").find(
    (record) => record.fileName === questionFileName,
  );
  return construction ? normalize(construction, "construction") : undefined;
}
