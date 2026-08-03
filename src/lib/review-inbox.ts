import type { ReviewItemSubject } from "@/lib/review-items";

export type ReviewInboxStatus = "draft" | "ready" | "synced" | "archived";

export interface ReviewInboxCandidate {
  id: string;
  title: string;
  subject: ReviewItemSubject;
  topic: string;
  year?: number;
  questionId?: string;
  sourceUrl?: string;
  errorReason: string;
  prompt: string;
  minimumAnswer: string;
  visualRequired: boolean;
  visualNote: string;
  status: ReviewInboxStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReviewInboxCandidateInput = Omit<
  ReviewInboxCandidate,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export const REVIEW_INBOX_KEY = "past-question-review-inbox-v1";
export const REVIEW_INBOX_EVENT = "past-question-review-inbox-change";
export const REVIEW_INBOX_NOTION_URL =
  "https://app.notion.com/p/b24d5b4a42a8403697bfffed35f35505";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `review-candidate-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function writeReviewInbox(items: ReviewInboxCandidate[]) {
  window.localStorage.setItem(REVIEW_INBOX_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(REVIEW_INBOX_EVENT));
}

export function readReviewInbox(): ReviewInboxCandidate[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(REVIEW_INBOX_KEY) ?? "[]");
    return Array.isArray(value) ? (value as ReviewInboxCandidate[]) : [];
  } catch {
    return [];
  }
}

export function saveReviewInboxCandidate(
  input: ReviewInboxCandidateInput,
): ReviewInboxCandidate {
  const items = readReviewInbox();
  const now = new Date().toISOString();
  const duplicate = input.questionId
    ? items.find((item) => item.questionId === input.questionId && item.status !== "archived")
    : undefined;

  if (duplicate) {
    const next = { ...duplicate, ...input, updatedAt: now };
    writeReviewInbox(items.map((item) => (item.id === duplicate.id ? next : item)));
    return next;
  }

  const next: ReviewInboxCandidate = {
    ...input,
    id: makeId(),
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  writeReviewInbox([next, ...items]);
  return next;
}

export function updateReviewInboxCandidate(
  id: string,
  update: Partial<Pick<ReviewInboxCandidate, "status" | "minimumAnswer" | "visualNote">>,
) {
  const items = readReviewInbox();
  writeReviewInbox(
    items.map((item) =>
      item.id === id ? { ...item, ...update, updatedAt: new Date().toISOString() } : item,
    ),
  );
}

export function importReviewInbox(value: unknown): number {
  if (!Array.isArray(value)) return 0;
  const incoming = value.filter(
    (item): item is ReviewInboxCandidate =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as ReviewInboxCandidate).id === "string" &&
      typeof (item as ReviewInboxCandidate).title === "string" &&
      typeof (item as ReviewInboxCandidate).subject === "string",
  );
  const current = readReviewInbox();
  const merged = new Map(current.map((item) => [item.id, item]));
  for (const item of incoming) merged.set(item.id, item);
  writeReviewInbox([...merged.values()]);
  return incoming.length;
}
