import type { PlanningPracticeMode } from "./planning-library-types";

export interface PlanningItemProgress {
  attempts: number;
  correct: number;
  streak: number;
  lastSeenAt: string;
  byMode: Partial<Record<PlanningPracticeMode, { attempts: number; correct: number }>>;
}

export interface PlanningSession {
  mode: PlanningPracticeMode;
  date: string;
  correct: number;
  total: number;
  completedAt: string;
}

export interface PlanningLibraryProgress {
  version: 1;
  items: Record<string, PlanningItemProgress>;
  sessions: PlanningSession[];
}

export type PlanningFamiliarity = "unseen" | "learning" | "familiar" | "mastered";

export const PLANNING_LIBRARY_PROGRESS_KEY = "planning-library-progress-v1";
export const EMPTY_PLANNING_LIBRARY_PROGRESS: PlanningLibraryProgress = { version: 1, items: {}, sessions: [] };

export function localPlanningDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function readPlanningProgress(): PlanningLibraryProgress {
  if (typeof window === "undefined") return EMPTY_PLANNING_LIBRARY_PROGRESS;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PLANNING_LIBRARY_PROGRESS_KEY) ?? "null") as Partial<PlanningLibraryProgress> | null;
    return parsed?.version === 1 && parsed.items && Array.isArray(parsed.sessions)
      ? { version: 1, items: parsed.items, sessions: parsed.sessions }
      : EMPTY_PLANNING_LIBRARY_PROGRESS;
  } catch {
    return EMPTY_PLANNING_LIBRARY_PROGRESS;
  }
}

export function writePlanningProgress(progress: PlanningLibraryProgress) {
  window.localStorage.setItem(PLANNING_LIBRARY_PROGRESS_KEY, JSON.stringify(progress));
}

export function planningFamiliarity(progress?: PlanningItemProgress): PlanningFamiliarity {
  if (!progress?.attempts) return "unseen";
  const accuracy = progress.correct / progress.attempts;
  if (progress.attempts >= 5 && accuracy >= 0.9 && progress.streak >= 3) return "mastered";
  if (progress.attempts >= 3 && accuracy >= 0.8) return "familiar";
  return "learning";
}

export function planningDailyStreak(sessions: PlanningSession[], today = localPlanningDate()) {
  const dates = new Set(sessions.filter((session) => session.mode === "daily" && session.total >= 10).map((session) => session.date));
  const cursor = new Date(`${today}T12:00:00`);
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(localPlanningDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

