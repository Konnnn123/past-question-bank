export type ReviewItemRating = 0 | 1 | 2 | 3;

export interface ReviewItemState {
  itemId: string;
  rating: ReviewItemRating;
  reviewCount: number;
  lastReviewedAt: string;
  nextReviewAt: string;
}

export type ReviewItemStateMap = Record<string, ReviewItemState>;

export const REVIEW_ITEM_STATES_KEY = "past-question-review-items-v1";
export const REVIEW_ITEM_STATES_EVENT = "past-question-review-items-change";

const REVIEW_DELAY_DAYS: Record<ReviewItemRating, number> = {
  0: 1,
  1: 2,
  2: 4,
  3: 7,
};

export function readReviewItemStates(): ReviewItemStateMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(
      window.localStorage.getItem(REVIEW_ITEM_STATES_KEY) ?? "{}",
    ) as ReviewItemStateMap;
  } catch {
    return {};
  }
}

export function saveReviewItemRating(
  itemId: string,
  rating: ReviewItemRating,
): ReviewItemState {
  const states = readReviewItemStates();
  const now = new Date();
  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + REVIEW_DELAY_DAYS[rating]);

  const next: ReviewItemState = {
    itemId,
    rating,
    reviewCount: (states[itemId]?.reviewCount ?? 0) + 1,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewAt.toISOString(),
  };

  states[itemId] = next;
  window.localStorage.setItem(REVIEW_ITEM_STATES_KEY, JSON.stringify(states));
  window.dispatchEvent(new Event(REVIEW_ITEM_STATES_EVENT));
  return next;
}

export function isReviewItemDue(
  state: ReviewItemState | undefined,
  now = new Date(),
): boolean {
  if (!state) return true;
  return state.nextReviewAt <= now.toISOString();
}
