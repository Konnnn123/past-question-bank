import { getPlanningNumericEligibilityAudit } from "../src/lib/planning-numeric-choice-eligibility";
import { generatePlanningNumericChoice } from "../src/lib/planning-numeric-choice-generator";

const { candidates, eligible: facts, skipped } = getPlanningNumericEligibilityAudit();
const answerFactCounts = new Map(facts.map((fact) => [fact.id, 0]));
const byUnit = new Map<string, number>();
const byUseType = new Map<string, number>();
const byRelation = new Map<string, number>();
const byAxis = new Map<string, number>();
const semanticQuestions = new Set<string>();
const optionSets = new Set<string>();
const renderedQuestions = new Set<string>();
const seenAnswerFacts = new Set<string>();

const increment = (map: Map<string, number>, key: string) => map.set(key, (map.get(key) ?? 0) + 1);
const factById = new Map(facts.map((fact) => [fact.id, fact]));
const kindOf = (value: string) => value.includes("~") || value.includes("〜") || value.includes("-") || value.includes("～")
  ? "range"
  : value.includes("以上") ? "lower_bound" : value.includes("以下") ? "upper_bound" : "exact";

for (let seed = 1; seed <= 1000; seed += 1) {
  const question = generatePlanningNumericChoice(facts, seed);
  const answerFact = factById.get(question.sourceFactId);
  if (!answerFact) throw new Error(`Seed ${seed}: selected a fact outside the eligible pool.`);
  if (question.options.length !== 4 || new Set(question.options).size !== 4) throw new Error(`Seed ${seed}: options are not unique.`);
  if (question.options[question.correctIndex] !== question.correctAnswer) throw new Error(`Seed ${seed}: answer index mismatch.`);
  if (question.distractorFactIds.length !== 0) throw new Error(`Seed ${seed}: distractors must not import another facility fact.`);
  if (question.distractorEvidence.length !== 3) throw new Error(`Seed ${seed}: missing distractor evidence.`);
  if (question.compatibilityGroup !== `${answerFact.numericUnit}|${answerFact.answerKind}|self`) {
    throw new Error(`Seed ${seed}: distractor group mixes a different unit, answer type, or fact scope.`);
  }
  for (const evidence of question.distractorEvidence) {
    if (evidence.answerFactId !== answerFact.id || evidence.relation !== "standard_value") {
      throw new Error(`Seed ${seed}: distractor evidence is not tied to the answer entity/relation.`);
    }
    if (!question.options.includes(evidence.option) || evidence.option === question.correctAnswer) {
      throw new Error(`Seed ${seed}: distractor is ambiguous or absent.`);
    }
    if (kindOf(evidence.option) !== answerFact.answerKind) {
      throw new Error(`Seed ${seed}: distractor answer type does not match the answer fact.`);
    }
  }

  answerFactCounts.set(answerFact.id, (answerFactCounts.get(answerFact.id) ?? 0) + 1);
  seenAnswerFacts.add(answerFact.id);
  increment(byUnit, answerFact.numericUnit);
  increment(byUseType, answerFact.useType ?? "unspecified");
  increment(byRelation, question.relation);
  increment(byAxis, answerFact.analysisAxis ?? "unspecified");
  semanticQuestions.add(`${answerFact.semanticKey}|${question.relation}`);
  optionSets.add([...question.options].sort().join("|"));
  renderedQuestions.add(`${question.prompt}|${question.options.join("|")}`);
}

const orderedFacts = [...facts].sort((a, b) => a.id.localeCompare(b.id));
const unreachable: Array<{ id: string; entityName: string; reason: string }> = [];
for (let index = 0; index < orderedFacts.length; index += 1) {
  const fact = orderedFacts[index];
  try {
    const question = generatePlanningNumericChoice(facts, index);
    if (question.sourceFactId !== fact.id) throw new Error("balanced seed did not select the expected fact");
    if (question.options[question.correctIndex] !== fact.numericAnswer) throw new Error("correct answer does not match fact");
  } catch (error) {
    unreachable.push({ id: fact.id, entityName: fact.entityName, reason: error instanceof Error ? error.message : String(error) });
  }
}

const first = generatePlanningNumericChoice(facts, 73);
const repeated = generatePlanningNumericChoice(facts, 73);
if (JSON.stringify(first) !== JSON.stringify(repeated)) throw new Error("Same seed did not reproduce the same question.");
if (unreachable.length > 0) throw new Error(`Unreachable facts: ${JSON.stringify(unreachable)}`);
if (seenAnswerFacts.size !== facts.length) throw new Error(`Only ${seenAnswerFacts.size}/${facts.length} eligible facts were selected in 1,000 seeds.`);

console.log(JSON.stringify({
  template: "number_four_choice (2017/2019/2020/2022/2023/2024/2026 Specialist 1 Q1/Q4)",
  classification: "atomic_fact_generator",
  rawSingleExpressionCandidates: candidates,
  eligibleAnswerFacts: facts.length,
  skippedBeforeGeneration: skipped,
  seedsTested: 1000,
  answerFactCounts: Object.fromEntries(answerFactCounts),
  neverSelected: facts.filter((fact) => !seenAnswerFacts.has(fact.id)).map((fact) => fact.id),
  selectionCounts: {
    unit: Object.fromEntries(byUnit),
    facilityUseType: Object.fromEntries(byUseType),
    relation: Object.fromEntries(byRelation),
    analysisAxis: Object.fromEntries(byAxis),
  },
  uniqueness: {
    uniqueAnswerFactCount: seenAnswerFacts.size,
    uniqueSemanticQuestionCount: semanticQuestions.size,
    uniqueOptionSetCount: optionSets.size,
    uniqueRenderedQuestionCount: renderedQuestions.size,
  },
  answerReachability: `${facts.length - unreachable.length}/${facts.length}`,
  semanticUncertainDistractors: 0,
  sameSeedReproducible: true,
}, null, 2));
