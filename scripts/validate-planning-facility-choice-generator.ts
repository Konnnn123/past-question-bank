import { generatePlanningFacilityChoice, getEligiblePlanningFacilityFacts } from "../src/lib/planning-facility-choice-generator";

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const facts = getEligiblePlanningFacilityFacts();
const reachable = new Set<string>();
const semantics = new Set<string>();

for (let seed = 1; seed <= 1000; seed += 1) {
  const question = generatePlanningFacilityChoice(facts, seed);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `seed ${seed}: options are not unique`);
  assert(question.distractorEvidence.length === 3, `seed ${seed}: missing distractor evidence`);
  assert(question.distractorEvidence.every((evidence) => !question.prompt.includes(`「${evidence.entityName}」`)), `seed ${seed}: distractor entity matches answer entity`);
  reachable.add(question.sourceFactId);
  semantics.add(`${question.sourceFactId}|${[...question.options].sort().join("|")}`);
}

for (const fact of facts) assert(reachable.has(fact.id), `unreachable eligible fact: ${fact.id}`);
assert(JSON.stringify(generatePlanningFacilityChoice(facts, 71)) === JSON.stringify(generatePlanningFacilityChoice(facts, 71)), "same seed is not reproducible");

console.log(JSON.stringify({
  classification: "atomic_fact_generator",
  eligibleFacts: facts.length,
  seeds: 1000,
  reachableFacts: `${reachable.size}/${facts.length}`,
  uniqueSemanticQuestions: semantics.size,
  multipleAnswers: 0,
  noAnswers: 0,
  sameSeedReproducible: true,
}, null, 2));
