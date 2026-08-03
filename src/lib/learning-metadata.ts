import metadata from "../../data/question-learning-metadata.json";

export type LearningMode = "past_exam_reconstruction" | "question_bank_sampler" | "rubric_guided_practice" | "validated_generator" | "deprecated_prototype";

export type LearningMetadata = {
  id: string;
  subject: string;
  year: number;
  question_id: string;
  subquestion_id: string;
  coverage_count: number;
  mode: LearningMode;
  surface_format: string;
  cognitive_task: string;
  knowledge_relation: string;
  topic_tags: string[];
  answer_basis: string;
  common_error_tags: string[];
  confidence: "verified" | "draft" | "incomplete";
};

const entries = metadata.entries as LearningMetadata[];

export function getLearningMetadata(id: string): LearningMetadata {
  const entry = entries.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`Missing learning metadata: ${id}`);
  return entry;
}

export const LEARNING_METADATA = {
  planning: getLearningMetadata("planning-2023-q4-s01-s20"),
  constructionRc: getLearningMetadata("construction-rc-shared-wordbank"),
  environmentVentilation: getLearningMetadata("environment-ventilation-co2"),
  historyImageMatching: getLearningMetadata("history-2019-q5-image-matching"),
} as const;
