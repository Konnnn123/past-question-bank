export type EnvironmentFormulaFact = {
  id: string;
  subject: "environment";
  entityType: "formula";
  entityName: string;
  relation: "formula_text";
  value: string;
  confidence: "high" | "medium" | "low" | "candidate";
  reviewStatus: string;
  usableBlueprints: string[];
  domain: string;
  sourceId: string;
  sourceField: string;
  evidenceText: string;
};

export type GeneratedEnvironmentFormulaChoice = {
  id: string;
  seed: number;
  classification: "atomic_fact_generator";
  templateId: "formula_to_quantity";
  sourceFactId: string;
  source: { sourceId: string; sourceField: string; evidenceText: string };
  prompt: string;
  answer: string;
  options: string[];
  relation: "formula_text";
  domain: string;
  distractorAudit: Array<{ term: string; sourceFactId: string; isFalseForPrompt: true; reason: string }>;
};

function shuffle<T>(items: T[], seed: number): T[] {
  const next = [...items];
  let state = seed >>> 0;
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const target = state % (index + 1);
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

export function getEligibleEnvironmentFormulaFacts(facts: EnvironmentFormulaFact[]) {
  const seenNames = new Set<string>();
  return facts.filter((fact) => {
    const eligible = fact.subject === "environment"
      && fact.entityType === "formula"
      && fact.relation === "formula_text"
      && (fact.confidence === "high" || fact.confidence === "medium")
      && fact.usableBlueprints.includes("formula_to_quantity")
      && Boolean(fact.value.trim())
      && Boolean(fact.entityName.trim())
      && !seenNames.has(fact.entityName);
    if (eligible) seenNames.add(fact.entityName);
    return eligible;
  });
}

export function generateEnvironmentFormulaChoice(facts: EnvironmentFormulaFact[], seed: number): GeneratedEnvironmentFormulaChoice {
  const eligible = getEligibleEnvironmentFormulaFacts(facts);
  if (eligible.length < 4) throw new Error(`environment formula choice requires at least 4 eligible facts; received ${eligible.length}`);
  const [correct, ...remaining] = shuffle(eligible, seed);
  const distractors = shuffle(remaining, seed + 101).slice(0, 3);
  const options = shuffle([correct.entityName, ...distractors.map((fact) => fact.entityName)], seed + 211);
  if (new Set(options).size !== 4) throw new Error("environment formula choice could not construct unique options");
  return {
    id: `environment-formula-to-quantity:${correct.id}:${seed >>> 0}`,
    seed,
    classification: "atomic_fact_generator",
    templateId: "formula_to_quantity",
    sourceFactId: correct.id,
    source: { sourceId: correct.sourceId, sourceField: correct.sourceField, evidenceText: correct.evidenceText },
    prompt: `次の式が表す物理量として、最も適切なものを一つ選びなさい。\n\n${correct.value}`,
    answer: correct.entityName,
    options,
    relation: "formula_text",
    domain: correct.domain,
    distractorAudit: distractors.map((fact) => ({
      term: fact.entityName,
      sourceFactId: fact.id,
      isFalseForPrompt: true as const,
      reason: `${fact.entityName} is explicitly defined by its own distinct formula: ${fact.value}`,
    })),
  };
}
