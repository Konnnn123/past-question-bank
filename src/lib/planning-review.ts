import fs from "fs";
import path from "path";

export type AnswerItem = {
  itemId: string;
  reviewStatus: string;
  choice: string;
  answer: string;
  evidenceCards: string[];
};

export type PairingReference = {
  reviewStatus: string;
  group1: { choice: string; answer: string };
  group2: { choice: string; answer: string };
};

export type PlanningAnswerRecord = {
  questionId: string;
  fileName: string;
  items: AnswerItem[];
  pairingReference?: PairingReference[];
  questionCards?: string[];
};

type CardIndex = {
  links: Array<{ fileName: string; cardName: string }>;
};

export function getPlanningAnswerRecords(): PlanningAnswerRecord[] {
  const answerPath = path.resolve(process.cwd(), "data/planning-exam-answers.json");
  const indexPath = path.resolve(process.cwd(), "data/planning-exam-card-index.json");
  const source = JSON.parse(fs.readFileSync(answerPath, "utf-8")) as { records: PlanningAnswerRecord[] };
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as CardIndex;

  return source.records.map((record) => ({
    ...record,
    items: record.items ?? [],
    questionCards: [...new Set(index.links.filter((link) => link.fileName === record.fileName).map((link) => link.cardName))],
  }));
}
