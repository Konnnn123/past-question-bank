import { generateMaterialDensityQuestion, type MaterialDensityFact } from "../src/lib/building-construction-material-density-generator";

const facts: MaterialDensityFact[] = [
  { id: "building-const-density-01", material: "木材（スギ）", densityGPerCm3: 0.44, source: "2025 専門1 建築構法 Q3" },
  { id: "building-const-density-02", material: "鋼材", densityGPerCm3: 7.8, source: "2017 / 2020 / 2025 専門1 建築構法 Q3" },
  { id: "building-const-density-03", material: "普通コンクリート", densityGPerCm3: 2.3, source: "2017 / 2025 専門1 建築構法 Q3" },
  { id: "building-const-density-04", material: "ガラス", densityGPerCm3: 2.5, source: "2017 / 2020 専門1 建築構法 Q3" },
  { id: "building-const-density-05", material: "アルミニウム", densityGPerCm3: 2.7, source: "2017 専門1 建築構法 Q3" },
  { id: "building-const-density-06", material: "土", densityGPerCm3: 2.0, source: "2020 専門1 建築構法 Q3" },
];

function assert(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }

const coverage = new Set<string>();
const semanticQuestions = new Set<string>();
for (let seed = 1; seed <= 1000; seed += 1) {
  const question = generateMaterialDensityQuestion(facts, seed);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `seed ${seed}: options are not unique`);
  assert(question.options[question.correctIndex] === question.correctAnswer, `seed ${seed}: answer mismatch`);
  assert(question.validation.finite && question.validation.positive && question.validation.unitConsistent && question.validation.structuralMechanicsExcluded, `seed ${seed}: validation failed`);
  assert(!/buckling|Pcr|EI|second moment/i.test([question.prompt, ...question.options, question.correctAnswer].join(" ")), `seed ${seed}: Structural Mechanics leaked`);
  coverage.add(question.sourceFactId);
  semanticQuestions.add(`${question.sourceFactId}|${question.answerUnit}|${[...question.options].sort().join("|")}`);
}
for (const fact of facts) assert(coverage.has(fact.id), `unreachable fact: ${fact.id}`);
assert(JSON.stringify(generateMaterialDensityQuestion(facts, 37)) === JSON.stringify(generateMaterialDensityQuestion(facts, 37)), "same seed is not reproducible");
console.log(JSON.stringify({ decision: "pass", seeds: 1000, answerFactCoverage: `${coverage.size}/${facts.length}`, uniqueSemanticQuestions: semanticQuestions.size, multiAnswer: 0, invalidParameter: 0, sameSeedReproducible: true }, null, 2));
