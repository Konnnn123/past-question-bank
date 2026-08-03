export const ENVIRONMENT_VENTILATION_TEMPLATE = {
  id: "environment_numerical_calculation",
  familyId: "ventilation_co2",
  pastExamEvidence: "8/13年出題",
  formula: "Q = G / (Ci - Co)",
  answerUnit: "m³/h",
  classification: "verified_parameterized_generator" as const,
};

export const VENTILATION_PARAMETER_RULES = {
  G: { unit: "m³/h", min: 0.01, max: 0.025, step: 0.001, precision: 3 },
  Ci: { unit: "ppm", min: 800, max: 1500, step: 10, precision: 0 },
  Co: { unit: "ppm", min: 300, max: 600, step: 10, precision: 0 },
  concentrationDifference: { unit: "ppm", min: 300 },
  answer: { unit: "m³/h", min: 5, max: 200, precision: 1 },
} as const;

export type VentilationParameters = { G: number; Ci: number; Co: number };

export type GeneratedVentilationQuestion = {
  id: string;
  subject: "environment";
  format: "numerical_calculation";
  templateId: typeof ENVIRONMENT_VENTILATION_TEMPLATE.id;
  familyId: typeof ENVIRONMENT_VENTILATION_TEMPLATE.familyId;
  classification: typeof ENVIRONMENT_VENTILATION_TEMPLATE.classification;
  seed: number;
  prompt: string;
  correctAnswer: string;
  numericAnswer: number;
  workedSolution: string;
  assumptions: string[];
  examRef: string;
  reasoningSteps: number;
  parameters: VentilationParameters;
  audit: {
    formula: string;
    units: { G: string; Ci: string; Co: string; answer: string };
    validation: ReturnType<typeof validateVentilationQuestion>;
  };
};

function nextState(state: number) {
  return (state * 1664525 + 1013904223) >>> 0;
}

function pickStep(seed: number, min: number, max: number, step: number) {
  const count = Math.round((max - min) / step);
  return min + (seed % (count + 1)) * step;
}

function rounded(value: number, precision: number) {
  return Number(value.toFixed(precision));
}

export function calculateVentilationRate({ G, Ci, Co }: VentilationParameters) {
  return G / ((Ci - Co) * 1e-6);
}

export function validateVentilationQuestion(parameters: VentilationParameters, numericAnswer?: number) {
  const { G, Ci, Co } = parameters;
  const delta = Ci - Co;
  const calculated = calculateVentilationRate(parameters);
  const answer = numericAnswer ?? rounded(calculated, VENTILATION_PARAMETER_RULES.answer.precision);
  const inStep = (value: number, min: number, step: number) =>
    Math.abs((value - min) / step - Math.round((value - min) / step)) < 1e-9;

  const passed = {
    unitsConsistent: true,
    GInRange: G >= VENTILATION_PARAMETER_RULES.G.min && G <= VENTILATION_PARAMETER_RULES.G.max && inStep(G, VENTILATION_PARAMETER_RULES.G.min, VENTILATION_PARAMETER_RULES.G.step),
    CiInRange: Ci >= VENTILATION_PARAMETER_RULES.Ci.min && Ci <= VENTILATION_PARAMETER_RULES.Ci.max && inStep(Ci, VENTILATION_PARAMETER_RULES.Ci.min, VENTILATION_PARAMETER_RULES.Ci.step),
    CoInRange: Co >= VENTILATION_PARAMETER_RULES.Co.min && Co <= VENTILATION_PARAMETER_RULES.Co.max && inStep(Co, VENTILATION_PARAMETER_RULES.Co.min, VENTILATION_PARAMETER_RULES.Co.step),
    concentrationConstraint: delta >= VENTILATION_PARAMETER_RULES.concentrationDifference.min,
    noDivisionByZero: delta !== 0,
    finiteResult: Number.isFinite(calculated),
    answerInRange: answer >= VENTILATION_PARAMETER_RULES.answer.min && answer <= VENTILATION_PARAMETER_RULES.answer.max,
    displayedPrecisionMatches: answer === rounded(calculated, VENTILATION_PARAMETER_RULES.answer.precision),
  };
  return { ...passed, passed: Object.values(passed).every(Boolean), calculated };
}

export function generateVentilationQuestion(seed: number): GeneratedVentilationQuestion {
  let state = seed >>> 0;
  state = nextState(state);
  const G = rounded(pickStep(state, VENTILATION_PARAMETER_RULES.G.min, VENTILATION_PARAMETER_RULES.G.max, VENTILATION_PARAMETER_RULES.G.step), VENTILATION_PARAMETER_RULES.G.precision);
  state = nextState(state);
  const Co = pickStep(state, VENTILATION_PARAMETER_RULES.Co.min, VENTILATION_PARAMETER_RULES.Co.max, VENTILATION_PARAMETER_RULES.Co.step);
  state = nextState(state);
  const minDelta = Math.max(VENTILATION_PARAMETER_RULES.concentrationDifference.min, VENTILATION_PARAMETER_RULES.Ci.min - Co);
  const maxDelta = VENTILATION_PARAMETER_RULES.Ci.max - Co;
  const delta = pickStep(state, minDelta, maxDelta, VENTILATION_PARAMETER_RULES.Ci.step);
  const Ci = Co + delta;
  const parameters = { G, Ci, Co };
  const numericAnswer = rounded(calculateVentilationRate(parameters), VENTILATION_PARAMETER_RULES.answer.precision);
  const validation = validateVentilationQuestion(parameters, numericAnswer);

  if (!validation.passed) throw new Error(`Invalid ventilation question for seed ${seed}`);

  return {
    id: `env-runtime-ventilation-co2-${seed >>> 0}`,
    subject: "environment",
    format: "numerical_calculation",
    templateId: ENVIRONMENT_VENTILATION_TEMPLATE.id,
    familyId: ENVIRONMENT_VENTILATION_TEMPLATE.familyId,
    classification: ENVIRONMENT_VENTILATION_TEMPLATE.classification,
    seed,
    prompt: `室内の CO₂ 発生量を ${G.toFixed(3)} m³/h、室内許容濃度を ${Ci} ppm、外気濃度を ${Co} ppm とする。定常状態・完全混合を仮定したとき、1人当たりに必要な換気量 [m³/h] を求めなさい。`,
    correctAnswer: `${numericAnswer.toFixed(1)} m³/h`,
    numericAnswer,
    workedSolution: `Ci = ${Ci} ppm = ${(Ci * 1e-6).toFixed(6)}\nCo = ${Co} ppm = ${(Co * 1e-6).toFixed(6)}\nQ = G / (Ci − Co) = ${G.toFixed(3)} / (${(Ci * 1e-6).toFixed(6)} − ${(Co * 1e-6).toFixed(6)}) = ${numericAnswer.toFixed(1)} m³/h`,
    assumptions: ["定常状態", "完全混合", "室内 CO₂ 発生のみ"],
    examRef: ENVIRONMENT_VENTILATION_TEMPLATE.pastExamEvidence,
    reasoningSteps: 2,
    parameters,
    audit: {
      formula: ENVIRONMENT_VENTILATION_TEMPLATE.formula,
      units: { G: "m³/h", Ci: "ppm", Co: "ppm", answer: "m³/h" },
      validation,
    },
  };
}
