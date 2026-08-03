import type { ExamEvidence, LocalizedText } from "@/types/history-topic";

export interface LearningCardBase {
  id: string;
  name: LocalizedText;
  aliases: string[];
  period: LocalizedText;
  regions: string[];
  summary: LocalizedText;
  keywords: LocalizedText[];
  relatedBuildingIds: string[];
  relatedPersonIds: string[];
  relatedCardIds: string[];
  examEvidence: ExamEvidence[];
  reviewStatus: "draft" | "reviewed" | "verified";
}

export interface StyleLearningCard extends LearningCardBase {
  kind: "style";
  formationBackground: LocalizedText;
  structuralFeatures: LocalizedText[];
  spatialFeatures: LocalizedText[];
  visualClues: LocalizedText[];
  comparisonCardIds: string[];
  predecessorCardIds: string[];
  successorCardIds: string[];
}

export interface MovementLearningCard extends LearningCardBase {
  kind: "movement";
  socialBackground: LocalizedText[];
  reactionAgainst: LocalizedText[];
  development: LocalizedText[];
  principles: LocalizedText[];
  results: LocalizedText[];
  influencedStyleIds: string[];
  influencedMovementIds: string[];
}

export interface ArchitectLearningCard extends LearningCardBase {
  kind: "architect";
  lifeSummary: LocalizedText;
  designPrinciples: LocalizedText[];
  recurringFeatures: LocalizedText[];
  careerPhases: {
    label: LocalizedText;
    description: LocalizedText;
    buildingIds: string[];
  }[];
  influencedByIds: string[];
  influencedIds: string[];
}

export interface BuildingTypeLearningCard extends LearningCardBase {
  kind: "building-type";
  functionalPurpose: LocalizedText;
  structuralFeatures: LocalizedText[];
  spatialFeatures: LocalizedText[];
  evolution: LocalizedText[];
  comparisonCardIds: string[];
}

export type HistoryLearningCard = StyleLearningCard | MovementLearningCard | ArchitectLearningCard | BuildingTypeLearningCard;
