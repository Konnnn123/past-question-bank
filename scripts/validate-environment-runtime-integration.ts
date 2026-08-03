import fs from "fs";
import { assembleEnvironmentRuntimeMock } from "../src/lib/environment-runtime-mock";
import type { EnvironmentFormulaFact } from "../src/lib/environment-formula-choice-generator";
import type { EnvironmentPhenomenonFact } from "../src/lib/environment-phenomenon-wordbank-generator";
import type { EnvironmentCorrectStatementFact } from "../src/lib/environment-correct-statement-generator";
import blueprint from "../data/environment-full-exam-blueprint.json";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const facts = (JSON.parse(fs.readFileSync("data/atomic-facts.json", "utf8")) as { facts: EnvironmentFormulaFact[] }).facts;
const phenomenonFacts = (JSON.parse(fs.readFileSync("data/environment-phenomenon-approved-facts.json", "utf8")) as { facts: EnvironmentPhenomenonFact[] }).facts;
const correctStatementFacts = (JSON.parse(fs.readFileSync("data/environment-correct-statement-approved-propositions.json", "utf8")) as { propositions: EnvironmentCorrectStatementFact[] }).propositions;
const semanticMocks = new Set<string>();
for (let seed = 1; seed <= 100; seed += 1) {
  const mock = assembleEnvironmentRuntimeMock(facts, seed, phenomenonFacts, correctStatementFacts, { formulaChoiceCount: 0, includePhenomenonWordBank: false, includeCorrectStatement: false });
  assert(mock.numerical.audit.validation.passed, `seed ${seed}: invalid numerical question`);
  assert(mock.formulaChoices.length === 0, `seed ${seed}: formula choice count mismatch`);
  assert(!mock.phenomenonWordBank && !mock.correctStatement, `seed ${seed}: non-blueprint block included`);
  semanticMocks.add(mock.numerical.prompt);
}
const sameA = assembleEnvironmentRuntimeMock(facts, 628, phenomenonFacts, correctStatementFacts, { formulaChoiceCount: 0, includePhenomenonWordBank: false, includeCorrectStatement: false });
const sameB = assembleEnvironmentRuntimeMock(facts, 628, phenomenonFacts, correctStatementFacts, { formulaChoiceCount: 0, includePhenomenonWordBank: false, includeCorrectStatement: false });
assert(JSON.stringify(sameA) === JSON.stringify(sameB), "same seed does not reproduce complete environment runtime mock");
console.log(JSON.stringify({
  decision: "pass",
  completeMockSeeds: 100,
  blueprint: blueprint.id,
  runtimeItemsPerMock: { numerical: 1, formulaChoices: 0, phenomenonToTerm: 0, correctStatement: 0 },
  classifications: { numerical: "verified_parameterized_generator" },
  semanticMockCount: semanticMocks.size,
  sameSeedReproducible: true,
  generationFailures: 0,
}, null, 2));
