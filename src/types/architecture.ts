import type { ExamEvidence, LocalizedText } from "@/types/history-topic";

export type ArchitectureRegion = "japan" | "western" | "east-asian" | "global";
export type ReviewStatus = "imported" | "normalized" | "verified" | "exam-confirmed" | "needs-review";

export interface ImportanceProfile {
  academicImportance: 1 | 2 | 3;
  sourceImportance?: 1 | 2 | 3;
  examFrequency: number;
  examImportance: 1 | 2 | 3;
  personalPriority?: 1 | 2 | 3;
}

export interface ArchitectureSource {
  kind: "anki" | "past-exam" | "reference" | "manual";
  locator: string;
  note?: string;
}

export interface ArchitectureImage {
  id: string;
  fileName: string;
  buildingId?: string;
  source: ArchitectureSource;
}

export interface ArchitectPerson {
  id: string;
  name: LocalizedText;
  aliases: string[];
  roles: ("architect" | "engineer" | "patron" | "theorist" | "historical-figure")[];
  relatedBuildingIds: string[];
  relatedTopicIds: string[];
  sources: ArchitectureSource[];
}

export interface ArchitectureBuilding {
  id: string;
  name: LocalizedText;
  aliases: string[];
  period: LocalizedText;
  location: LocalizedText;
  regions: ArchitectureRegion[];
  typeIds: string[];
  styleIds: string[];
  movementIds: string[];
  theoryIds: string[];
  architectIds: string[];
  relatedPersonIds: string[];
  structure: LocalizedText;
  space: LocalizedText;
  history: LocalizedText;
  imageIds: string[];
  importance: ImportanceProfile;
  examEvidence: ExamEvidence[];
  sources: ArchitectureSource[];
  reviewStatus: ReviewStatus;
  qualityFlags: string[];
}

export interface ArchitectureDatabase {
  version: 1;
  buildings: ArchitectureBuilding[];
  people: ArchitectPerson[];
  images: ArchitectureImage[];
}
