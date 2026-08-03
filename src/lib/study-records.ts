export type StudyStatus = "unseen" | "correct" | "wrong" | "uncertain" | "later";

export interface QuestionStudyRecord {
  questionId: string;
  status: Exclude<StudyStatus, "unseen">;
  attempts: number;
  updatedAt: string;
  /** Optional source context for a real past-exam slot. Legacy records stay valid. */
  source?: {
    sourceQuestionId: string;
    sourceHref: string;
    sourceLabel: string;
    subject: string;
    year: number;
    topicTags: string[];
    cognitiveTask: string;
    answerBasis: string;
  };
}

export type StudyRecordMap = Record<string, QuestionStudyRecord>;

export const STUDY_RECORDS_KEY = "past-question-study-records-v1";
export const LAST_QUESTION_KEY = "past-question-last-question-v1";
export const STUDY_RECORDS_EVENT = "past-question-study-records-change";

export const STUDY_STATUS_META: Record<StudyStatus, { label: string; shortLabel: string; color: string }> = {
  unseen: { label: "未作答", shortLabel: "未做", color: "bg-slate-100 text-slate-600" },
  correct: { label: "答对了", shortLabel: "答对", color: "bg-emerald-100 text-emerald-700" },
  wrong: { label: "答错了", shortLabel: "错题", color: "bg-rose-100 text-rose-700" },
  uncertain: { label: "不确定", shortLabel: "不确定", color: "bg-amber-100 text-amber-700" },
  later: { label: "稍后再做", shortLabel: "稍后", color: "bg-violet-100 text-violet-700" },
};

export function readStudyRecords(): StudyRecordMap {
  if (typeof window === "undefined") return {};
  try {
    const value = window.localStorage.getItem(STUDY_RECORDS_KEY);
    return value ? (JSON.parse(value) as StudyRecordMap) : {};
  } catch {
    return {};
  }
}

export function saveStudyStatus(
  questionId: string,
  status: Exclude<StudyStatus, "unseen">,
  source?: QuestionStudyRecord["source"],
) {
  const records = readStudyRecords();
  const current = records[questionId];
  records[questionId] = {
    questionId,
    status,
    attempts: (current?.attempts ?? 0) + 1,
    updatedAt: new Date().toISOString(),
    source: source ?? current?.source,
  };
  window.localStorage.setItem(STUDY_RECORDS_KEY, JSON.stringify(records));
  window.localStorage.setItem(LAST_QUESTION_KEY, questionId);
  window.dispatchEvent(new Event(STUDY_RECORDS_EVENT));
  return records[questionId];
}
