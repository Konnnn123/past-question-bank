export type MaterialElasticityFact = {
  id: string;
  property: "youngs_modulus" | "linear_thermal_expansion";
  material: string;
  value: number;
  unit: "N/mm²" | "/K";
  examVersion: 2020 | "2017_2020";
  source: string;
};

export type MaterialElasticityQuestion = {
  id: string;
  classification: "verified_parameterized_generator";
  templateId: "building_construction_numerical";
  subRelationId: "8.1";
  sourceFactId: string;
  relation: "youngs_modulus" | "linear_thermal_expansion";
  prompt: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  sourceVersion: string;
  validation: { finite: true; positive: true; unitConsistent: true; sourceYearConstrained: true; structuralMechanicsExcluded: true };
};

export const BUILDING_CONSTRUCTION_MATERIAL_ELASTICITY_FACTS: MaterialElasticityFact[] = [
  { id: "building-const-modulus-01", property: "youngs_modulus", material: "木材（スギ）", value: 7000, unit: "N/mm²", examVersion: "2017_2020", source: "2017 / 2020 専門1 建築構法 Q3" },
  { id: "building-const-modulus-02", property: "youngs_modulus", material: "鋼材", value: 205000, unit: "N/mm²", examVersion: "2017_2020", source: "2017 / 2020 専門1 建築構法 Q3" },
  { id: "building-const-modulus-03", property: "youngs_modulus", material: "普通コンクリート（Fc=21 N/mm²）", value: 21000, unit: "N/mm²", examVersion: "2017_2020", source: "2017 / 2020 専門1 建築構法 Q3" },
  { id: "building-const-expansion-01", property: "linear_thermal_expansion", material: "木材（スギ・繊維方向）", value: 5e-6, unit: "/K", examVersion: 2020, source: "2020 専門1 建築構法 Q3" },
  { id: "building-const-expansion-02", property: "linear_thermal_expansion", material: "鋼材", value: 1.2e-5, unit: "/K", examVersion: 2020, source: "2020 専門1 建築構法 Q3" },
  { id: "building-const-expansion-03", property: "linear_thermal_expansion", material: "普通コンクリート（Fc=21 N/mm²）", value: 1e-5, unit: "/K", examVersion: 2020, source: "2020 専門1 建築構法 Q3" },
];

const nextRandom = (state: number) => (Math.imul(state, 1664525) + 1013904223) >>> 0;
function shuffled<T>(items: T[], seed: number): T[] { const output = [...items]; let state = seed >>> 0; for (let i = output.length - 1; i > 0; i -= 1) { state = nextRandom(state); const j = state % (i + 1); [output[i], output[j]] = [output[j], output[i]]; } return output; }
function display(value: number, unit: MaterialElasticityFact["unit"]) { return unit === "N/mm²" ? `${Math.round(value).toLocaleString("en-US")} ${unit}` : `${value.toExponential(1).replace("e-", "×10⁻")} ${unit}`; }

/** Source-year scoped material facts; each distractor is an explicit decimal-order error within the fact's own unit family. */
export function generateMaterialElasticityQuestion(facts: MaterialElasticityFact[], property: MaterialElasticityFact["property"], seed: number): MaterialElasticityQuestion {
  const pool = facts.filter((fact) => fact.property === property);
  if (!pool.length) throw new Error(`No ${property} facts supplied.`);
  const fact = [...pool].sort((a, b) => a.id.localeCompare(b.id))[(seed >>> 0) % pool.length];
  const alternatives = [fact.value / 10, fact.value * 10, fact.value * 100];
  if (![fact.value, ...alternatives].every((value) => Number.isFinite(value) && value > 0) || new Set([fact.value, ...alternatives]).size !== 4) throw new Error(`Invalid ${property} alternatives for ${fact.id}.`);
  const records = shuffled([{ value: fact.value, correct: true }, ...alternatives.map((value) => ({ value, correct: false }))], nextRandom(seed));
  const options = records.map((record) => display(record.value, fact.unit));
  const correctIndex = records.findIndex((record) => record.correct);
  if (correctIndex < 0 || new Set(options).size !== 4) throw new Error(`Non-unique ${property} options for ${fact.id}.`);
  const isModulus = property === "youngs_modulus";
  const sourceYearConstrained = fact.property === "linear_thermal_expansion" ? fact.examVersion === 2020 : fact.examVersion === "2017_2020";
  if (!sourceYearConstrained) throw new Error(`Source-year convention mismatch for ${fact.id}.`);
  return { id: `building-construction-${property}-${seed >>> 0}`, classification: "verified_parameterized_generator", templateId: "building_construction_numerical", subRelationId: "8.1", sourceFactId: fact.id, relation: property, prompt: isModulus ? `「${fact.material}」のヤング係数として最も適切な値を選びなさい。` : `${fact.examVersion}年度の出題値として、「${fact.material}」の線膨張係数を選びなさい。`, options, correctIndex, correctAnswer: display(fact.value, fact.unit), sourceVersion: String(fact.examVersion), validation: { finite: true, positive: true, unitConsistent: true, sourceYearConstrained: true, structuralMechanicsExcluded: true } };
}
