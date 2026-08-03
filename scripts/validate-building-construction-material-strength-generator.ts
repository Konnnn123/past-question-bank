import { BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS, generateDistinctMaterialStrengthQuestions, generateMaterialStrengthQuestion } from "../src/lib/building-construction-material-strength-generator";

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const coverage = new Set<string>();
const relations = new Set<string>();
const semanticQuestions = new Set<string>();
for (let seed = 1; seed <= 1000; seed += 1) {
  const question = generateMaterialStrengthQuestion(BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS, seed);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `seed ${seed}: options are not unique`);
  assert(question.options[question.correctIndex] === question.correctAnswer, `seed ${seed}: answer mismatch`);
  assert(question.validation.finite && question.validation.positive && question.validation.unitConsistent && question.validation.structuralMechanicsExcluded, `seed ${seed}: parameter validation failed`);
  assert(!/buckling|Pcr|EI|second moment/i.test([question.prompt, ...question.options].join(" ")), `seed ${seed}: Structural Mechanics leaked`);
  coverage.add(question.sourceFactId);
  relations.add(question.relation);
  semanticQuestions.add(`${question.sourceFactId}|${question.relation}|${[...question.options].sort().join("|")}`);
  const selected = generateDistinctMaterialStrengthQuestions(BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS, seed, 2);
  assert(selected.length === 2 && new Set(selected.map((item) => item.sourceFactId)).size === 2 && new Set(selected.map((item) => item.correctAnswer)).size === 2, `seed ${seed}: cannot form unique full-mock strength pair`);
}
for (const fact of BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS) assert(coverage.has(fact.id), `unreachable fact: ${fact.id}`);
assert(relations.size === 2, "both source-backed relation forms must be reachable");
assert(JSON.stringify(generateMaterialStrengthQuestion(BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS, 37)) === JSON.stringify(generateMaterialStrengthQuestion(BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS, 37)), "same seed is not reproducible");
console.log(JSON.stringify({ decision: "pass", seeds: 1000, answerFactCoverage: `${coverage.size}/${BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS.length}`, relations: [...relations].sort(), uniqueSemanticQuestions: semanticQuestions.size, multiAnswer: 0, invalidParameter: 0, sameSeedReproducible: true }, null, 2));
