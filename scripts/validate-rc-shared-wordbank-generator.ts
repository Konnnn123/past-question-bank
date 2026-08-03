import fs from "fs";
import { generateRCSharedWordBank, type SharedWordBankFact } from "../src/lib/building-construction-shared-wordbank-generator";

const facts = JSON.parse(fs.readFileSync("data/building-construction-rc-shared-wordbank-facts.json", "utf8")).facts as SharedWordBankFact[];
const EXPECTED_POOL_SIZE = 33;
const EXAM_BANK_SIZE = 27;
const ANSWER_COUNT = 20;
const SURPLUS_COUNT = 7;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function selectedFactIds(generated: ReturnType<typeof generateRCSharedWordBank>) {
  return [...generated.items.map((item) => item.factId), ...generated.surplusTerms.map((term) => facts.find((fact) => fact.term === term)?.id ?? "")];
}

function validateExam(pool: SharedWordBankFact[], seed: number) {
  const generated = generateRCSharedWordBank(pool, seed);
  const answerTerms = generated.items.map((item) => item.answer);
  const answerFactIds = generated.items.map((item) => item.factId);
  const surplusTerms = generated.surplusTerms;
  const allTerms = [...answerTerms, ...surplusTerms];
  const allFactIds = selectedFactIds(generated);

  assert(generated.wordBank.length === EXAM_BANK_SIZE, `seed ${seed}: selected terms must be ${EXAM_BANK_SIZE}`);
  assert(generated.items.length === ANSWER_COUNT, `seed ${seed}: answer facts must be ${ANSWER_COUNT}`);
  assert(surplusTerms.length === SURPLUS_COUNT, `seed ${seed}: surplus terms must be ${SURPLUS_COUNT}`);
  assert(new Set(generated.wordBank).size === EXAM_BANK_SIZE, `seed ${seed}: duplicate selected term`);
  assert(new Set(allTerms).size === EXAM_BANK_SIZE, `seed ${seed}: answer/surplus term overlap`);
  assert(new Set(answerFactIds).size === ANSWER_COUNT, `seed ${seed}: duplicate answer fact`);
  assert(new Set(allFactIds).size === EXAM_BANK_SIZE && !allFactIds.includes(""), `seed ${seed}: duplicate or unresolved selected fact`);
  assert(answerTerms.every((term) => !surplusTerms.includes(term)), `seed ${seed}: answer term appears in surplus`);
  assert(generated.validation.uniqueAnswers, `seed ${seed}: generator unique-answer validation failed`);
  return { generated, allFactIds };
}

assert(facts.length === EXPECTED_POOL_SIZE, `expected ${EXPECTED_POOL_SIZE} reviewed facts, received ${facts.length}`);
assert(facts.every((fact) => fact.source && fact.statement && fact.relation), "unreviewed or incomplete fact");
assert(!/buckling|structural_mechanics|effective_buckling|second_moment/i.test(JSON.stringify(facts)), "scope leakage");

// Exact 27-term pools remain valid and deterministic.
const legacyPool = facts.slice(0, EXAM_BANK_SIZE);
const legacyFirst = validateExam(legacyPool, 77).generated;
const legacySecond = validateExam(legacyPool, 77).generated;
assert(JSON.stringify(legacyFirst) === JSON.stringify(legacySecond), "27-term pool is not reproducible for an identical seed");

// Full 33-term pool: run 100 reproducible selections and collect actual coverage.
const coverage = new Set<string>();
const selections: string[][] = [];
for (let seed = 1; seed <= 1000; seed += 1) {
  const { allFactIds } = validateExam(facts, seed);
  allFactIds.forEach((id) => coverage.add(id));
  selections.push([...allFactIds].sort());
}
assert(coverage.size === facts.length, `100-run coverage incomplete: ${coverage.size}/${facts.length}`);

const sameSeedA = generateRCSharedWordBank(facts, 5001);
const sameSeedB = generateRCSharedWordBank(facts, 5001);
assert(JSON.stringify(sameSeedA) === JSON.stringify(sameSeedB), "full-pool generation is not reproducible for an identical seed");
const differentSeed = generateRCSharedWordBank(facts, 5002);
assert(JSON.stringify(selectedFactIds(sameSeedA).sort()) !== JSON.stringify(selectedFactIds(differentSeed).sort()), "different seeds did not change the selected 27-fact subset");

let smallPoolError = "";
try {
  generateRCSharedWordBank(facts.slice(0, EXAM_BANK_SIZE - 1), 1);
} catch (error) {
  smallPoolError = error instanceof Error ? error.message : String(error);
}
assert(smallPoolError === "RC shared-word-bank requires at least 27 unique reviewed facts; received 26", "short pool did not produce the required clear error");

console.log(JSON.stringify({
  decision: "usable_with_limited_pool_diversity",
  poolSize: facts.length,
  perExamSelected: EXAM_BANK_SIZE,
  answerFacts: ANSWER_COUNT,
  surplusTerms: SURPLUS_COUNT,
  legacy27Pool: "pass",
  fullPoolRuns: 1000,
  coverage: { selectedFacts: `${coverage.size}/${facts.length}`, allFactsSelected: coverage.size === facts.length },
  sameSeedReproducible: true,
  differentSeedChangesSubset: true,
  shortPoolError: smallPoolError,
  releaseGate: {
    seed_pool_size_gte_27: "pass",
    per_exam_selected_27: "pass",
    answer_count_20: "pass",
    surplus_count_7: "pass",
    no_duplicate_term: "pass",
    no_duplicate_fact: "pass",
    answer_surplus_disjoint: "pass",
    deterministic_under_same_seed: "pass",
    full_pool_coverage_verified: "pass",
    generator_validation_passes: "pass"
  },
  gates: { uniqueSelectedTerms: "pass", answerSurplusDisjoint: "pass", uniqueAnswerFacts: "pass", generationFailures: 0, scope: "pass" }
}, null, 2));
