/**
 * Review States — aggregated per-question review tracking
 * ========================================================
 * One ReviewState per question (aggregates all attempts).
 * Drives the error queue and spaced-repetition logic.
 *
 * localStorage key: past-question-review-states-v2
 */

export interface ReviewState {
  questionId: string;
  subject: string;
  blueprintId: string;
  wrongCount: number;
  uncertainCount: number;
  correctAfterWrongCount: number;
  firstWrongAt: string | null;
  lastWrongAt: string | null;
  nextReviewAt: string | null;
  status: "active" | "temporarily_mastered" | "resolved" | "suspended";
  userNote: string;
  reportedIssue: boolean;
}

const KEY = "past-question-review-states-v2";
const OLD_KEY = "past-question-study-records-v1";

export function readReviewStates(): Record<string, ReviewState> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, ReviewState>;
  } catch {
    return {};
  }
}

function writeReviewStates(states: Record<string, ReviewState>) {
  window.localStorage.setItem(KEY, JSON.stringify(states));
}

export function getReviewState(questionId: string): ReviewState | undefined {
  return readReviewStates()[questionId];
}

export function upsertReviewState(
  questionId: string,
  subject: string,
  blueprintId: string,
  update: Partial<ReviewState>,
): ReviewState {
  const states = readReviewStates();
  const existing = states[questionId];

  const now = new Date().toISOString();

  const next: ReviewState = existing
    ? {
        ...existing,
        ...update,
        questionId,
        subject: subject || existing.subject,
        blueprintId: blueprintId || existing.blueprintId,
      }
    : {
        questionId,
        subject,
        blueprintId,
        wrongCount: 0,
        uncertainCount: 0,
        correctAfterWrongCount: 0,
        firstWrongAt: null,
        lastWrongAt: null,
        nextReviewAt: null,
        status: "active",
        userNote: "",
        reportedIssue: false,
        ...update,
      };

  states[questionId] = next;
  writeReviewStates(states);
  return next;
}

/**
 * Apply spaced-repetition rules after a wrong/uncertain answer.
 */
export function applyReviewSchedule(
  questionId: string,
  result: "wrong" | "uncertain",
): ReviewState {
  const state = getReviewState(questionId);
  if (!state) return state!;

  const now = new Date();
  const updates: Partial<ReviewState> = {};

  if (result === "wrong") {
    updates.wrongCount = (state.wrongCount || 0) + 1;
    updates.lastWrongAt = now.toISOString();
    if (!state.firstWrongAt) updates.firstWrongAt = now.toISOString();

    const count = updates.wrongCount!;
    // Schedule: 1st → tomorrow, 2nd → 3 days, 3rd+ → 7 days
    const delayMs =
      count === 1 ? 24 * 60 * 60 * 1000 :
      count === 2 ? 3 * 24 * 60 * 60 * 1000 :
      7 * 24 * 60 * 60 * 1000;
    updates.nextReviewAt = new Date(now.getTime() + delayMs).toISOString();
    updates.status = "active";
  } else {
    // uncertain
    updates.uncertainCount = (state.uncertainCount || 0) + 1;
    updates.nextReviewAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
    updates.status = "active";
  }

  return upsertReviewState(questionId, state.subject, state.blueprintId, updates);
}

/**
 * Mark as temporarily mastered after 2 consecutive correct answers.
 */
export function markTemporarilyMastered(questionId: string): ReviewState {
  const state = getReviewState(questionId);
  if (!state) return state!;

  const newCorrectCount = (state.correctAfterWrongCount || 0) + 1;
  const updates: Partial<ReviewState> = {
    correctAfterWrongCount: newCorrectCount,
  };

  if (newCorrectCount >= 2) {
    updates.status = "temporarily_mastered";
    updates.nextReviewAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }

  return upsertReviewState(questionId, state.subject, state.blueprintId, updates);
}

/**
 * Verify temporarily-mastered → resolved.
 */
export function markResolved(questionId: string): ReviewState {
  const state = getReviewState(questionId);
  if (!state) return state!;
  return upsertReviewState(questionId, state.subject, state.blueprintId, {
    status: "resolved",
    nextReviewAt: null,
  });
}

export function markLater(questionId: string): ReviewState {
  const state = getReviewState(questionId);
  if (!state) return state!;
  return upsertReviewState(questionId, state.subject, state.blueprintId, {
    nextReviewAt: null,
  });
}

export function reportIssue(questionId: string): ReviewState {
  const state = getReviewState(questionId);
  if (!state) return state!;
  return upsertReviewState(questionId, state.subject, state.blueprintId, {
    status: "suspended",
    reportedIssue: true,
  });
}

/**
 * Get questions due for review (nextReviewAt <= now).
 */
export function getDueForReview(subject?: string): ReviewState[] {
  const states = readReviewStates();
  const now = new Date().toISOString();
  return Object.values(states).filter((s) =>
    s.nextReviewAt &&
    s.nextReviewAt <= now &&
    s.status === "active" &&
    (!subject || s.subject === subject)
  );
}

/**
 * Get all active error questions for the error queue.
 */
export function getErrorQueue(subject?: string): ReviewState[] {
  const states = readReviewStates();
  return Object.values(states).filter((s) =>
    (s.wrongCount > 0 || s.uncertainCount > 0 || s.status === "active") &&
    s.status !== "resolved" &&
    (!subject || s.subject === subject)
  );
}

/**
 * Migrate from old StudyRecordMap to new ReviewState format.
 * Does NOT delete old data.
 */
export function migrateFromV1(): number {
  if (typeof window === "undefined") return 0;

  try {
    const old = window.localStorage.getItem(OLD_KEY);
    if (!old) return 0;

    const oldRecords = JSON.parse(old) as Record<string, {
      questionId: string;
      status: string;
      attempts: number;
      updatedAt: string;
    }>;

    const states = readReviewStates();
    let migrated = 0;

    for (const [qid, rec] of Object.entries(oldRecords)) {
      if (states[qid]) continue; // already migrated

      const status = rec.status;
      states[qid] = {
        questionId: qid,
        subject: "",
        blueprintId: "",
        wrongCount: status === "wrong" ? rec.attempts : 0,
        uncertainCount: status === "uncertain" ? rec.attempts : 0,
        correctAfterWrongCount: 0,
        firstWrongAt: status === "wrong" ? rec.updatedAt : null,
        lastWrongAt: status === "wrong" ? rec.updatedAt : null,
        nextReviewAt: null,
        status: status === "later" ? "active" :
                status === "wrong" || status === "uncertain" ? "active" : "resolved",
        userNote: "",
        reportedIssue: false,
      };
      migrated++;
    }

    writeReviewStates(states);
    return migrated;
  } catch {
    return 0;
  }
}
