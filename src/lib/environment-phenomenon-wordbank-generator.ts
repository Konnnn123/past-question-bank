export type EnvironmentPhenomenonFact = {
  id: string;
  subject: "environment";
  relation: "defined_as";
  canonicalTerm: string;
  phenomenonDescription: string;
  domain: string;
  conditions: string;
  sourceDocument: string;
  sourceLocation: string;
  reviewStatus: "candidate" | "confirmed" | "approved" | "rejected";
  templateCompatibility: string;
  possibleAmbiguity: string;
  possibleConfusableTerms: string[];
};

export const PHENOMENON_TEMPLATE = {
  id: "phenomenon_to_term",
  sourcePrototype: "2022 専門1 建築環境工学 Q2",
  answerCount: 7,
  bankSize: 16,
  surplusCount: 9,
  reuseAllowed: false,
} as const;

function shuffle<T>(items: T[], seed: number): T[] {
  const result = [...items]; let state = seed >>> 0;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const target = state % (index + 1); [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function getEligibleEnvironmentPhenomenonFacts(facts: EnvironmentPhenomenonFact[]) {
  const terms = new Set<string>();
  return facts.filter((fact) => {
    const eligible = fact.subject === "environment"
      && fact.relation === "defined_as"
      && (fact.reviewStatus === "confirmed" || fact.reviewStatus === "approved")
      && fact.templateCompatibility === "compatible"
      && Boolean(fact.conditions.trim())
      && Boolean(fact.sourceDocument.trim())
      && Boolean(fact.sourceLocation.trim())
      && Boolean(fact.phenomenonDescription.trim())
      && !terms.has(fact.canonicalTerm);
    if (eligible) terms.add(fact.canonicalTerm);
    return eligible;
  });
}

export function generateEnvironmentPhenomenonWordBank(facts: EnvironmentPhenomenonFact[], seed: number) {
  const eligible = getEligibleEnvironmentPhenomenonFacts(facts);
  if (eligible.length < PHENOMENON_TEMPLATE.bankSize) {
    const domains = [...new Set(facts.filter((fact) => fact.reviewStatus === "candidate").map((fact) => fact.domain))].sort();
    throw new Error(`phenomenon_to_term requires ${PHENOMENON_TEMPLATE.bankSize} confirmed compatible facts for ${PHENOMENON_TEMPLATE.answerCount} answers + ${PHENOMENON_TEMPLATE.surplusCount} constrained surplus; approved=${eligible.length}; candidateDomains=${domains.join(",") || "none"}`);
  }
  const selected = shuffle(eligible, seed).slice(0, PHENOMENON_TEMPLATE.bankSize);
  const answers = selected.slice(0, PHENOMENON_TEMPLATE.answerCount);
  const surplus = selected.slice(PHENOMENON_TEMPLATE.answerCount);
  const answerTerms = new Set(answers.map((fact) => fact.canonicalTerm));
  if (new Set(selected.map((fact) => fact.canonicalTerm)).size !== PHENOMENON_TEMPLATE.bankSize || surplus.some((fact) => answerTerms.has(fact.canonicalTerm))) throw new Error("phenomenon_to_term unique-answer validation failed");
  return {
    template: PHENOMENON_TEMPLATE,
    items: answers.map((fact, index) => ({ id: `env-phen-${index + 1}`, factId: fact.id, prompt: fact.phenomenonDescription, answer: fact.canonicalTerm, domain: fact.domain, conditions: fact.conditions })),
    wordBank: shuffle(selected.map((fact) => fact.canonicalTerm), seed + 83),
    surplusTerms: surplus.map((fact) => fact.canonicalTerm),
  };
}
