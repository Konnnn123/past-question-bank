import { getConfirmedFacts, type AtomicFact } from "@/lib/atomic-fact-store";

type FacilityFact = AtomicFact & { useType?: string; analysisAxis?: string; conceptLevel?: string };

export type PlanningFacilityChoiceQuestion = {
  id: string;
  classification: "atomic_fact_generator";
  templateId: "planning_facility_fact_recall";
  sourceFactId: string;
  relation: "has_feature";
  prompt: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  distractorEvidence: Array<{ factId: string; entityName: string; reason: string }>;
  compatibilityGroup: string;
};

const nextRandom = (state: number) => (Math.imul(state, 1664525) + 1013904223) >>> 0;

function shuffled<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = nextRandom(state);
    const target = state % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Eligible facts are confirmed `Facility → Spatial Feature` records. A choice
 * is only formed within one use type and from distinct named facilities.
 */
export function getEligiblePlanningFacilityFacts(): FacilityFact[] {
  const raw = (getConfirmedFacts("planning") as FacilityFact[]).filter((fact) =>
    fact.relation === "has_feature" && Boolean(fact.useType) && normalize(fact.value).length >= 20,
  );
  const entityAndValue = new Set<string>();
  const deduplicated = raw.filter((fact) => {
    const key = `${fact.entityName}|${normalize(fact.value)}`;
    if (entityAndValue.has(key)) return false;
    entityAndValue.add(key);
    return true;
  });
  return deduplicated.filter((fact) => deduplicated.filter((peer) =>
    peer.useType === fact.useType && peer.entityName !== fact.entityName && normalize(peer.value) !== normalize(fact.value),
  ).length >= 3);
}

export function generatePlanningFacilityChoice(facts: FacilityFact[], seed: number): PlanningFacilityChoiceQuestion {
  const suppliedIds = new Set(facts.map((fact) => fact.id));
  const pool = getEligiblePlanningFacilityFacts().filter((fact) => suppliedIds.has(fact.id));
  if (pool.length < 4) throw new Error("Planning facility generator requires four eligible confirmed feature facts.");

  const ordered = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  const answer = ordered[(seed >>> 0) % ordered.length];
  const peers = shuffled(pool.filter((fact) =>
    fact.useType === answer.useType && fact.entityName !== answer.entityName && normalize(fact.value) !== normalize(answer.value),
  ), nextRandom(seed));
  const distractors = peers.slice(0, 3);
  if (distractors.length !== 3) throw new Error(`No three same-domain source-backed distractors for ${answer.id}.`);

  const records = shuffled([
    { value: answer.value, correct: true },
    ...distractors.map((fact) => ({ value: fact.value, correct: false })),
  ], nextRandom(nextRandom(seed)));
  const options = records.map((record) => record.value);
  const correctIndex = records.findIndex((record) => record.correct);
  if (new Set(options.map(normalize)).size !== 4 || correctIndex < 0) {
    throw new Error(`Non-unique facility options for ${answer.id}.`);
  }

  return {
    id: `planning-facility-choice-${seed >>> 0}`,
    classification: "atomic_fact_generator",
    templateId: "planning_facility_fact_recall",
    sourceFactId: answer.id,
    relation: "has_feature",
    prompt: `「${answer.entityName}」の特徴として、最も適切な記述を一つ選びなさい。`,
    options,
    correctIndex,
    correctAnswer: answer.value,
    distractorEvidence: distractors.map((fact) => ({
      factId: fact.id,
      entityName: fact.entityName,
      reason: `Source-backed feature of 「${fact.entityName}」, not the selected fact for 「${answer.entityName}」; both are constrained to useType=${answer.useType}.`,
    })),
    compatibilityGroup: answer.useType!,
  };
}
