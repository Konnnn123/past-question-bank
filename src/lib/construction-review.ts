import fs from "fs";
import path from "path";

export type ConstructionAnswerItem = {
  itemId: string;
  prompt?: string;
  answer: string;
  reviewStatus: "card-supported-draft" | "partial-image-draft" | "image-source-unresolved";
  drawingPoints?: string[];
};

export type ConstructionAnswerRecord = {
  questionId: string;
  fileName: string;
  items: ConstructionAnswerItem[];
};

export function getConstructionAnswerRecords(): ConstructionAnswerRecord[] {
  const sourcePath = path.resolve(process.cwd(), "data/construction-exam-answers.json");
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf-8")) as { records: ConstructionAnswerRecord[] };
  return source.records;
}
