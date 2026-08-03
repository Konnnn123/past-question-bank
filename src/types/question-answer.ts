export type AnswerReliability = "source-supported" | "ai-draft" | "questionable";

export interface QuestionAnswerItem {
  itemId: string;
  prompt?: string;
  choice?: string;
  answer: string;
  explanation?: string;
  drawingPoints?: string[];
  sourceStatus: string;
  reliability: AnswerReliability;
}

export interface QuestionAnswerRecord {
  fileName: string;
  subject: "planning" | "construction";
  items: QuestionAnswerItem[];
}
