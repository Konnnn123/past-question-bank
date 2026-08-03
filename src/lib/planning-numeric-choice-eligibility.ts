import { getConfirmedFacts, type AtomicFact } from "@/lib/atomic-fact-store";
import type { NumericAnswerKind, PlanningNumericFact } from "@/lib/planning-numeric-choice-generator";

type PlanningFact = AtomicFact & {
  useType?: string;
  analysisAxis?: string;
  conceptLevel?: string;
};

export interface IneligiblePlanningNumericFact {
  id: string;
  entityName: string;
  numericAnswer: string;
  reason: string;
}

const numericExpression = /\d+(?:\.\d+)?(?:\s*(?:~|〜|-|～)\s*\d+(?:\.\d+)?)?\s*(?:m²|㎡|m³|m3|cm|m|%|床|人|台|lx|dB|階|戸)(?:\s*\/\s*(?:人|席|床))?(?:以上|以下|程度)?/g;

function extractNumericAnswer(value: string): { answer: string; unit: string } | null {
  const matches = [...value.matchAll(numericExpression)].map((match) => match[0].replace(/\s+/g, " ").trim());
  if (matches.length !== 1) return null;
  const answer = matches[0];
  const unitMatch = answer.match(/m²|㎡|m³|m3|cm|m|%|床|人|台|lx|dB|階|戸/);
  if (!unitMatch) return null;
  return { answer, unit: unitMatch[0].replace("㎡", "m²").replace("m3", "m³") };
}

function answerKind(answer: string): NumericAnswerKind {
  if (answer.includes("~") || answer.includes("〜") || answer.includes("-") || answer.includes("～")) return "range";
  if (answer.includes("以上")) return "lower_bound";
  if (answer.includes("以下")) return "upper_bound";
  return "exact";
}

function exclusionReason(fact: PlanningFact, answer: string): string | null {
  if (fact.conceptLevel !== "numeric_standard") return "relation_metadata_is_not_numeric_standard";
  if (/\d+階段/.test(fact.value)) return "numeric_token_is_part_of_a_word_not_a_floor_standard";
  if (answer === "1人" && /1人当たり/.test(fact.value)) return "numeric_token_is_a_qualifier_not_the_standard_value";
  if (/^1[^\d]+.*2[^\d]+.*3[^\d]+.*4[^\d]+/.test(fact.value)) return "numeric_token_is_an_enumerated_list_item_not_a_standard_value";
  return null;
}

function semanticKey(entityName: string, answer: string): string {
  return `${entityName}|${answer.replace(/[\s程度]/g, "").replace("㎡", "m²").replace("m3", "m³")}`;
}

function collectCandidates(): Array<{ fact: PlanningFact; numeric: { answer: string; unit: string } }> {
  const byEntityAndAnswer = new Set<string>();
  return getConfirmedFacts("planning")
    .filter((fact): fact is PlanningFact => fact.relation === "standard_value")
    .flatMap((fact) => {
      const numeric = extractNumericAnswer(fact.value);
      if (!numeric) return [];
      const dedupeKey = `${fact.entityName}|${numeric.answer}`;
      if (byEntityAndAnswer.has(dedupeKey)) return [];
      byEntityAndAnswer.add(dedupeKey);
      return [{ fact, numeric }];
    });
}

/**
 * The raw 35 candidates are first screened for whether the extracted number is
 * actually the entity's standard. This prevents list ordinals and contextual
 * counts from becoming answer options merely because they contain a unit token.
 */
export function getPlanningNumericEligibilityAudit(): {
  candidates: number;
  eligible: PlanningNumericFact[];
  skipped: IneligiblePlanningNumericFact[];
} {
  const eligible: PlanningNumericFact[] = [];
  const skipped: IneligiblePlanningNumericFact[] = [];
  for (const { fact, numeric } of collectCandidates()) {
    const reason = exclusionReason(fact, numeric.answer);
    if (reason) {
      skipped.push({ id: fact.id, entityName: fact.entityName, numericAnswer: numeric.answer, reason });
      continue;
    }
    eligible.push({
      id: fact.id,
      entityName: fact.entityName,
      value: fact.value,
      sourceType: fact.sourceType,
      sourceId: fact.sourceId,
      sourceField: fact.sourceField,
      confidence: fact.confidence as "high" | "medium",
      useType: fact.useType,
      analysisAxis: fact.analysisAxis,
      conceptLevel: fact.conceptLevel,
      numericAnswer: numeric.answer,
      numericUnit: numeric.unit,
      answerKind: answerKind(numeric.answer),
      semanticKey: semanticKey(fact.entityName, numeric.answer),
    });
  }
  return { candidates: collectCandidates().length, eligible, skipped };
}

export function getEligiblePlanningNumericFacts(): PlanningNumericFact[] {
  return getPlanningNumericEligibilityAudit().eligible;
}
