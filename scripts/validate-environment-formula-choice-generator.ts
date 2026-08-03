import fs from "fs";
import {
  generateEnvironmentFormulaChoice,
  getEligibleEnvironmentFormulaFacts,
  type EnvironmentFormulaFact,
} from "../src/lib/environment-formula-choice-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const store = JSON.parse(fs.readFileSync("data/atomic-facts.json", "utf8")) as { facts: EnvironmentFormulaFact[] };
const eligible = getEligibleEnvironmentFormulaFacts(store.facts);
const coverage = new Set<string>();
const semanticQuestions = new Set<string>();
for (let seed = 1; seed <= 1000; seed += 1) {
  const question = generateEnvironmentFormulaChoice(eligible, seed);
  coverage.add(question.sourceFactId);
  semanticQuestions.add(`${question.sourceFactId}:${[...question.options].sort().join("|")}`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `seed ${seed}: options are not unique`);
  assert(question.options.includes(question.answer), `seed ${seed}: answer is absent`);
  assert(question.distractorAudit.length === 3, `seed ${seed}: distractor count mismatch`);
  assert(question.distractorAudit.every((audit) => audit.isFalseForPrompt && audit.sourceFactId !== question.sourceFactId), `seed ${seed}: invalid distractor evidence`);
}
const sameA = generateEnvironmentFormulaChoice(eligible, 741);
const sameB = generateEnvironmentFormulaChoice(eligible, 741);
assert(JSON.stringify(sameA) === JSON.stringify(sameB), "same seed is not reproducible");
assert(coverage.size === eligible.length, `eligible coverage incomplete: ${coverage.size}/${eligible.length}`);
console.log(JSON.stringify({
  decision: "pass",
  classification: "atomic_fact_generator",
  template: "formula_to_quantity",
  seedsTested: 1000,
  eligibleFacts: eligible.length,
  factCoverage: `${coverage.size}/${eligible.length}`,
  semanticQuestions: semanticQuestions.size,
  ambiguousQuestions: 0,
  sameSeedReproducible: true,
}, null, 2));
