export type HistoryPracticeMode = "image" | "chronology" | "architect" | "daily";

export interface BuildingLearningProgress {
  attempts: number;
  correct: number;
  streak: number;
  lastSeenAt: string;
  byMode: Partial<Record<HistoryPracticeMode, { attempts: number; correct: number }>>;
}

export interface HistoryPracticeSession {
  mode: HistoryPracticeMode;
  date: string;
  correct: number;
  total: number;
  completedAt: string;
}

export interface HistoryLibraryProgress {
  version: 1;
  buildings: Record<string, BuildingLearningProgress>;
  sessions: HistoryPracticeSession[];
}

export type Familiarity = "unseen" | "learning" | "familiar" | "mastered";

export const HISTORY_LIBRARY_PROGRESS_KEY = "history-library-progress-v1";

export const EMPTY_HISTORY_LIBRARY_PROGRESS: HistoryLibraryProgress = {
  version: 1,
  buildings: {},
  sessions: [],
};

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readHistoryLibraryProgress(): HistoryLibraryProgress {
  if (typeof window === "undefined") return EMPTY_HISTORY_LIBRARY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(HISTORY_LIBRARY_PROGRESS_KEY);
    if (!raw) return EMPTY_HISTORY_LIBRARY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<HistoryLibraryProgress>;
    if (parsed.version !== 1 || !parsed.buildings || !Array.isArray(parsed.sessions)) return EMPTY_HISTORY_LIBRARY_PROGRESS;
    return { version: 1, buildings: parsed.buildings, sessions: parsed.sessions };
  } catch {
    return EMPTY_HISTORY_LIBRARY_PROGRESS;
  }
}

export function writeHistoryLibraryProgress(progress: HistoryLibraryProgress) {
  window.localStorage.setItem(HISTORY_LIBRARY_PROGRESS_KEY, JSON.stringify(progress));
}

export function familiarityOf(progress?: BuildingLearningProgress): Familiarity {
  if (!progress?.attempts) return "unseen";
  const accuracy = progress.correct / progress.attempts;
  if (progress.attempts >= 5 && accuracy >= 0.9 && progress.streak >= 3) return "mastered";
  if (progress.attempts >= 3 && accuracy >= 0.8) return "familiar";
  return "learning";
}

export function dailyStreak(sessions: HistoryPracticeSession[], today = localDateKey()) {
  const completedDates = new Set(sessions.filter((session) => session.mode === "daily" && session.total >= 10).map((session) => session.date));
  const cursor = new Date(`${today}T12:00:00`);
  if (!completedDates.has(today)) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (completedDates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
