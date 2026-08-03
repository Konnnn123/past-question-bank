import { generateVentilationQuestion } from "../src/lib/environment-ventilation-generator";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const prompts = new Set<string>();
const parameterSets = new Set<string>();
for (let seed = 1; seed <= 1000; seed += 1) {
  const question = generateVentilationQuestion(seed);
  const validation = question.audit.validation;
  assert(validation.passed, `seed ${seed}: validation failed`);
  assert(question.correctAnswer === `${question.numericAnswer.toFixed(1)} m³/h`, `seed ${seed}: answer display mismatch`);
  assert(Math.abs(validation.calculated - question.numericAnswer) < 0.051, `seed ${seed}: answer recomputation mismatch`);
  prompts.add(question.prompt);
  parameterSets.add(JSON.stringify(question.parameters));
}

assert(prompts.size >= 800, `insufficient prompt diversity: ${prompts.size}/1000`);
assert(parameterSets.size >= 800, `insufficient parameter diversity: ${parameterSets.size}/1000`);

const sameSeedA = generateVentilationQuestion(501);
const sameSeedB = generateVentilationQuestion(501);
const differentSeed = generateVentilationQuestion(502);
assert(JSON.stringify(sameSeedA) === JSON.stringify(sameSeedB), "same seed is not reproducible");
assert(sameSeedA.prompt !== differentSeed.prompt, "different seeds did not change the question");

console.log(JSON.stringify({
  template: sameSeedA.templateId,
  family: sameSeedA.familyId,
  classification: sameSeedA.classification,
  seedsTested: 1000,
  allSolvable: true,
  illegalParameterSets: 0,
  answerRecomputationFailures: 0,
  distinctPrompts: prompts.size,
  distinctParameterSets: parameterSets.size,
  sameSeedReproducible: true,
  differentSeedChangesQuestion: true,
}, null, 2));
