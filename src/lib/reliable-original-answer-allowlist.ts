import allowlist from "../../data/reliable-original-answer-allowlist.json";

type AllowlistEntry = (typeof allowlist.entries)[number];

/** The sole membership check allowed before automatic grading of an original item. */
export function isReliableOriginalAnswerAllowed(
  subject: AllowlistEntry["subject"],
  sourceFile: string,
  subquestionId: string,
) {
  return allowlist.entries.some(
    (entry) => entry.subject === subject && entry.sourceFile === sourceFile && entry.subquestionIds.includes(subquestionId),
  );
}

export { allowlist as reliableOriginalAnswerAllowlist };
