export type MaterialDensityFact = {
  id: string;
  material: string;
  densityGPerCm3: number;
  source: string;
};

export type MaterialDensityQuestion = {
  id: string;
  classification: "verified_parameterized_generator";
  templateId: "building_construction_numerical";
  subRelationId: "8.1";
  sourceFactId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  answerUnit: "g/cm³" | "kg/m³";
  validation: { finite: true; positive: true; unitConsistent: true; structuralMechanicsExcluded: true };
};

export const BUILDING_CONSTRUCTION_MATERIAL_DENSITY_FACTS: MaterialDensityFact[] = [
  { id: "building-const-density-01", material: "木材（スギ）", densityGPerCm3: 0.44, source: "2025 専門1 建築構法 Q3" },
  { id: "building-const-density-02", material: "鋼材", densityGPerCm3: 7.8, source: "2017 / 2020 / 2025 専門1 建築構法 Q3" },
  { id: "building-const-density-03", material: "普通コンクリート", densityGPerCm3: 2.3, source: "2017 / 2025 専門1 建築構法 Q3" },
  { id: "building-const-density-04", material: "ガラス", densityGPerCm3: 2.5, source: "2017 / 2020 専門1 建築構法 Q3" },
  { id: "building-const-density-05", material: "アルミニウム", densityGPerCm3: 2.7, source: "2017 専門1 建築構法 Q3" },
  { id: "building-const-density-06", material: "土", densityGPerCm3: 2.0, source: "2020 専門1 建築構法 Q3" },
];

const nextRandom = (state: number) => (Math.imul(state, 1664525) + 1013904223) >>> 0;

function shuffled<T>(items: T[], seed: number): T[] {
  const output = [...items];
  let state = seed >>> 0;
  for (let i = output.length - 1; i > 0; i -= 1) {
    state = nextRandom(state);
    const j = state % (i + 1);
    [output[i], output[j]] = [output[j], output[i]];
  }
  return output;
}

function render(value: number, unit: "g/cm³" | "kg/m³") {
  return unit === "g/cm³" ? `${value.toFixed(2).replace(/0$/, "")} ${unit}` : `${Math.round(value)} ${unit}`;
}

/**
 * The fact fixes the material density. The seeded variation only changes the
 * requested equivalent unit and the order of three mathematically false scale
 * alternatives; no Structural Mechanics value can enter this generator.
 */
export function generateMaterialDensityQuestion(facts: MaterialDensityFact[], seed: number): MaterialDensityQuestion {
  if (!facts.length) throw new Error("Material-density generator requires at least one sourced fact.");
  if (new Set(facts.map((fact) => fact.id)).size !== facts.length) throw new Error("Material-density fact ids must be unique.");
  const fact = [...facts].sort((a, b) => a.id.localeCompare(b.id))[(seed >>> 0) % facts.length];
  if (!Number.isFinite(fact.densityGPerCm3) || fact.densityGPerCm3 <= 0) throw new Error(`Invalid density for ${fact.id}.`);

  // The fact cycle is `seed % facts.length`; use the next cycle index for the
  // unit so every sourced fact can appear in both equivalent-unit variants.
  const unit: "g/cm³" | "kg/m³" = (Math.floor((seed >>> 0) / facts.length) & 1) === 0 ? "g/cm³" : "kg/m³";
  const correctValue = unit === "g/cm³" ? fact.densityGPerCm3 : fact.densityGPerCm3 * 1000;
  const candidateValues = unit === "g/cm³"
    ? [correctValue / 10, correctValue * 10, correctValue * 100]
    : [correctValue / 10, correctValue * 10, correctValue / 1000];
  const allValues = [correctValue, ...candidateValues];
  if (allValues.some((value) => !Number.isFinite(value) || value <= 0) || new Set(allValues).size !== 4) {
    throw new Error(`Could not construct unique density alternatives for ${fact.id}.`);
  }
  const records = shuffled([
    { value: correctValue, correct: true },
    ...candidateValues.map((value) => ({ value, correct: false })),
  ], nextRandom(nextRandom(seed)));
  const options = records.map((record) => render(record.value, unit));
  const correctIndex = records.findIndex((record) => record.correct);
  if (correctIndex < 0 || new Set(options).size !== 4) throw new Error(`Non-unique density options for ${fact.id}.`);

  return {
    id: `building-construction-density-${seed >>> 0}`,
    classification: "verified_parameterized_generator",
    templateId: "building_construction_numerical",
    subRelationId: "8.1",
    sourceFactId: fact.id,
    prompt: `「${fact.material}」の密度として最も適切な値を選びなさい。`,
    options,
    correctIndex,
    correctAnswer: render(correctValue, unit),
    answerUnit: unit,
    validation: { finite: true, positive: true, unitConsistent: true, structuralMechanicsExcluded: true },
  };
}
