/**
 * Attempt Records — per-answer persistence
 * ========================================
 * Each answer attempt is saved independently.
 * Separate from ReviewState (aggregated per-question).
 *
 * localStorage key: past-question-attempts-v2
 */

export interface AttemptRecord {
  id: string;          // crypto.randomUUID()
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  result: "correct" | "wrong" | "skipped";
  confidence: "sure" | "uncertain";
  errorType?:
    | "knowledge_gap"
    | "confusion"
    | "retrieval_failure"
    | "language_misread"
    | "numeric_or_unit"
    | "careless"
    | "source_or_question_issue";
  answeredAt: string;  // ISO
  /** Optional provenance captured by the past-exam trainer. Old records remain valid. */
  trainer?: {
    subject: "history" | "planning" | "building_construction" | "environment";
    year: number;
    cognitiveTask: string;
    knowledgeRelation: string;
    topicTags: string[];
    commonErrorTags: string[];
    sourceQuestionId?: string;
    mastered?: boolean;
  };
  /** Real past-exam provenance for answerable source slots. */
  pastExam?: {
    questionBlockId: string;
    subquestionId: string;
    subject: string;
    year: number;
    questionNumber: string;
    cognitiveTask: string;
    knowledgeRelation: string;
    topicTags: string[];
    commonErrorTags: string[];
    answerBasis: string;
    sourceHref: string;
    attemptCount: number;
  };
}

const KEY = "past-question-attempts-v2";

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function readAttempts(): AttemptRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as AttemptRecord[];
  } catch {
    return [];
  }
}

export function saveAttempt(record: Omit<AttemptRecord, "id" | "answeredAt">): AttemptRecord {
  const attempts = readAttempts();
  const full: AttemptRecord = {
    ...record,
    id: generateId(),
    answeredAt: new Date().toISOString(),
  };
  attempts.push(full);
  window.localStorage.setItem(KEY, JSON.stringify(attempts));
  return full;
}

export function getAttemptsForQuestion(questionId: string): AttemptRecord[] {
  return readAttempts().filter((a) => a.questionId === questionId);
}

export function getRecentAttempts(limit = 50): AttemptRecord[] {
  return readAttempts().slice(-limit).reverse();
}
