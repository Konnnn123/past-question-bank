export type MaterialStrengthFact = {
  id: string;
  material: string;
  baseStrength: number;
  shortTermAllowableFactor: number;
  source: string;
};

export type MaterialStrengthQuestion = {
  id: string;
  classification: "verified_parameterized_generator";
  templateId: "building_construction_numerical";
  subRelationId: "8.2";
  sourceFactId: string;
  relation: "material_strength" | "short_term_allowable_stress";
  prompt: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  validation: { finite: true; positive: true; unitConsistent: true; structuralMechanicsExcluded: true };
};

export const BUILDING_CONSTRUCTION_MATERIAL_STRENGTH_FACTS: MaterialStrengthFact[] = [
  { id: "building-const-strength-01", material: "木材（スギ）", baseStrength: 24, shortTermAllowableFactor: 2 / 3, source: "2015 / 2018 専門1 建築構法 Q2/Q3" },
  { id: "building-const-strength-02", material: "鋼材（SS400）", baseStrength: 240, shortTermAllowableFactor: 1, source: "2015 / 2018 / 2025 専門1 建築構法 Q2/Q3" },
  { id: "building-const-strength-03", material: "普通コンクリート", baseStrength: 24, shortTermAllowableFactor: 2 / 3, source: "2018 / 2025 専門1 建築構法 Q3" },
];

const nextRandom = (state: number) => (Math.imul(state, 1664525) + 1013904223) >>> 0;

function shuffled<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = nextRandom(state);
    const target = state % (index + 1);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function display(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)} N/mm²`;
}

/**
 * Fixed Specialist 1 material values are the source facts. A seed chooses
 * whether the question asks that value directly or applies its sourced
 * short-term allowable-stress factor; distractors are arithmetic alternatives
 * for that exact material and relation, not values from other disciplines.
 */
export function generateMaterialStrengthQuestion(facts: MaterialStrengthFact[], seed: number): MaterialStrengthQuestion {
  if (!facts.length) throw new Error("Material-strength generator requires at least one sourced fact.");
  const ordered = [...facts].sort((a, b) => a.id.localeCompare(b.id));
  const fact = ordered[(seed >>> 0) % ordered.length];
  if (!Number.isFinite(fact.baseStrength) || fact.baseStrength <= 0 || !Number.isFinite(fact.shortTermAllowableFactor) || fact.shortTermAllowableFactor <= 0) {
    throw new Error(`Invalid material-strength parameters for ${fact.id}.`);
  }
  const isAllowableStress = (Math.floor((seed >>> 0) / facts.length) & 1) === 1;
  const value = isAllowableStress ? fact.baseStrength * fact.shortTermAllowableFactor : fact.baseStrength;
  const relation = isAllowableStress ? "short_term_allowable_stress" : "material_strength";
  const distractorValues = isAllowableStress
    ? (fact.shortTermAllowableFactor === 1
      ? [fact.baseStrength / 2, fact.baseStrength * 2, fact.baseStrength / 3]
      : [fact.baseStrength, fact.baseStrength / 2, fact.baseStrength * (1 / 3)])
    : [fact.baseStrength / 10, fact.baseStrength / 2, fact.baseStrength * 2];
  if (new Set([value, ...distractorValues]).size !== 4 || [value, ...distractorValues].some((candidate) => !Number.isFinite(candidate) || candidate <= 0)) {
    throw new Error(`Could not construct unique strength alternatives for ${fact.id}.`);
  }
  const records = shuffled([{ value, correct: true }, ...distractorValues.map((candidate) => ({ value: candidate, correct: false }))], nextRandom(seed));
  const options = records.map((record) => display(record.value));
  const correctIndex = records.findIndex((record) => record.correct);
  if (correctIndex < 0 || new Set(options).size !== 4) throw new Error(`Non-unique strength options for ${fact.id}.`);

  return {
    id: `building-construction-strength-${seed >>> 0}`,
    classification: "verified_parameterized_generator",
    templateId: "building_construction_numerical",
    subRelationId: "8.2",
    sourceFactId: fact.id,
    relation,
    prompt: isAllowableStress
      ? `基準強度が ${display(fact.baseStrength)} の「${fact.material}」について、短期許容応力度として最も適切な値を選びなさい。`
      : `「${fact.material}」の基準強度として最も適切な値を選びなさい。`,
    options,
    correctIndex,
    correctAnswer: display(value),
    validation: { finite: true, positive: true, unitConsistent: true, structuralMechanicsExcluded: true },
  };
}

export function generateDistinctMaterialStrengthQuestions(facts: MaterialStrengthFact[], seed: number, count: number): MaterialStrengthQuestion[] {
  const results: MaterialStrengthQuestion[] = [];
  const answers = new Set<string>();
  const sourceIds = new Set<string>();
  for (let offset = 0; offset < facts.length * 8 && results.length < count; offset += 1) {
    const question = generateMaterialStrengthQuestion(facts, seed * 31 + offset);
    if (answers.has(question.correctAnswer) || sourceIds.has(question.sourceFactId)) continue;
    answers.add(question.correctAnswer);
    sourceIds.add(question.sourceFactId);
    results.push(question);
  }
  if (results.length !== count) throw new Error(`Could not select ${count} distinct material-strength questions.`);
  return results;
}
