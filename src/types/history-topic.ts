export type HistoryTopicKind =
  | "building-type"
  | "style"
  | "movement"
  | "theory"
  | "institution";

export type HistoryRegion = "western" | "japan" | "east-asian" | "global";

export interface LocalizedText {
  ja: string;
  zh: string;
}

export interface HistoricalPeriod {
  label: LocalizedText;
  startYear?: number;
  endYear?: number;
  display: string;
}

export interface ExamEvidence {
  year: number;
  category: "専門1" | "専門2-2";
  questionNumber: string;
  fileName: string;
  relation: "direct" | "related";
}

export interface HistoryTopic {
  id: string;
  kind: HistoryTopicKind;
  parentId?: string;
  name: LocalizedText;
  aliases: string[];
  regions: HistoryRegion[];
  period: HistoricalPeriod;
  summary: LocalizedText;
  keywords: LocalizedText[];
  background?: LocalizedText;
  characteristics?: LocalizedText[];
  evolution?: { previous?: string[]; next?: string[] };
  relatedTopicIds: string[];
  representativeBuildingIds: string[];
  examEvidence: ExamEvidence[];
  importance: 1 | 2 | 3;
  status: "core" | "extended";
}

export interface HistoryTopicGroup {
  id: string;
  kind: HistoryTopicKind;
  name: LocalizedText;
  description: LocalizedText;
}
