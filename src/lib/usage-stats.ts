/**
 * Usage Statistics — lightweight, local-only
 * ===========================================
 * Tracks practice session completion, accuracy, and error rates.
 * All data stored in localStorage. No remote servers.
 *
 * localStorage key: past-question-usage-stats-v1
 */

export interface SessionStat {
  sessionId: string;
  startedAt: string;
  subject: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  uncertainCount: number;
  skippedCount: number;
  sourceKind: "past-exam" | "generated" | "simulation" | "mixed";
}

export interface QuestionStat {
  questionId: string;
  subject: string;
  blueprintId: string;
  totalAttempts: number;
  correctAttempts: number;
  firstAttemptCorrect: boolean;
  lastAttemptAt: string;
  reportedCount: number;
}

interface UsageStats {
  version: 1;
  sessions: SessionStat[];
  questionStats: Record<string, QuestionStat>;
}

const KEY = "past-question-usage-stats-v1";

function read(): UsageStats {
  if (typeof window === "undefined") return { version: 1, sessions: [], questionStats: {} };
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{"version":1,"sessions":[],"questionStats":{}}') as UsageStats;
  } catch { return { version: 1, sessions: [], questionStats: {} }; }
}

function write(stats: UsageStats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

export function recordSession(session: Omit<SessionStat, "sessionId" | "startedAt">): SessionStat {
  const stats = read();
  const full: SessionStat = {
    ...session,
    sessionId: `s-${Date.now()}`,
    startedAt: new Date().toISOString(),
  };
  stats.sessions.push(full);

  // Keep only last 100 sessions
  if (stats.sessions.length > 100) stats.sessions = stats.sessions.slice(-100);

  write(stats);
  return full;
}

export function recordAnswer(questionId: string, subject: string, blueprintId: string, isCorrect: boolean) {
  const stats = read();
  const existing = stats.questionStats[questionId];

  if (existing) {
    existing.totalAttempts++;
    if (isCorrect) existing.correctAttempts++;
    existing.lastAttemptAt = new Date().toISOString();
  } else {
    stats.questionStats[questionId] = {
      questionId, subject, blueprintId,
      totalAttempts: 1,
      correctAttempts: isCorrect ? 1 : 0,
      firstAttemptCorrect: isCorrect,
      lastAttemptAt: new Date().toISOString(),
      reportedCount: 0,
    };
  }

  write(stats);
}

export function reportQuestion(questionId: string) {
  const stats = read();
  const qs = stats.questionStats[questionId];
  if (qs) {
    qs.reportedCount = (qs.reportedCount || 0) + 1;
    write(stats);
  }
}

export function getQuestionStats(questionId: string): QuestionStat | undefined {
  return read().questionStats[questionId];
}

/** Only show stats for questions with >= 5 attempts */
export function getReliableQuestionStats(): QuestionStat[] {
  return Object.values(read().questionStats).filter((q) => q.totalAttempts >= 5);
}

export function getBlueprintErrorRates(): Record<string, { total: number; errors: number; rate: number }> {
  const qs = Object.values(read().questionStats);
  const byBp: Record<string, { total: number; errors: number }> = {};

  for (const q of qs) {
    if (!byBp[q.blueprintId]) byBp[q.blueprintId] = { total: 0, errors: 0 };
    byBp[q.blueprintId].total += q.totalAttempts;
    byBp[q.blueprintId].errors += q.totalAttempts - q.correctAttempts;
  }

  const result: Record<string, { total: number; errors: number; rate: number }> = {};
  for (const [bp, d] of Object.entries(byBp)) {
    result[bp] = { ...d, rate: d.total > 0 ? Math.round((d.errors / d.total) * 100) : 0 };
  }
  return result;
}

export function getOverallStats() {
  const stats = read();
  const sessions = stats.sessions;
  const totalAnswered = sessions.reduce((s, sess) => s + sess.totalQuestions, 0);
  const totalCorrect = sessions.reduce((s, sess) => s + sess.correctCount, 0);
  const totalWrong = sessions.reduce((s, sess) => s + sess.wrongCount, 0);
  const totalUncertain = sessions.reduce((s, sess) => s + sess.uncertainCount, 0);

  return {
    totalSessions: sessions.length,
    totalAnswered,
    totalCorrect,
    totalWrong,
    totalUncertain,
    accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    reportedQuestions: Object.values(stats.questionStats).filter((q) => q.reportedCount > 0).length,
    questionsWithEnoughData: Object.values(stats.questionStats).filter((q) => q.totalAttempts >= 5).length,
  };
}
