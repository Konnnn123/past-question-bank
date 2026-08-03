export type NumericAnswerKind = "exact" | "range" | "upper_bound" | "lower_bound";

export interface PlanningNumericFact {
  id: string;
  entityName: string;
  value: string;
  sourceType: string;
  sourceId: string;
  sourceField: string;
  confidence: "high" | "medium";
  useType?: string;
  analysisAxis?: string;
  conceptLevel?: string;
  numericAnswer: string;
  numericUnit: string;
  answerKind: NumericAnswerKind;
  semanticKey: string;
}

export interface NumericDistractorEvidence {
  option: string;
  answerFactId: string;
  relation: "standard_value";
  reason: string;
}

export interface PlanningNumericChoiceQuestion {
  id: string;
  classification: "atomic_fact_generator";
  templateId: "number_four_choice";
  sourceFactId: string;
  distractorFactIds: [];
  prompt: string;
  options: string[];
  correctIndex: number;
  correctAnswer: string;
  explanation: string;
  relation: "standard_value";
  compatibilityGroup: string;
  distractorMode: "numeric_neighbor_from_answer_fact";
  distractorEvidence: NumericDistractorEvidence[];
}

const nextRandom = (state: number) => (Math.imul(state, 1664525) + 1013904223) >>> 0;

function shuffled<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0;
  for (let i = result.length - 1; i > 0; i -= 1) {
    state = nextRandom(state);
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function decimalPlaces(value: string): number {
  return value.includes(".") ? value.split(".")[1].length : 0;
}

function formatNumber(value: number, places: number): string {
  return places === 0 ? String(Math.round(value)) : value.toFixed(places);
}

function spacingFor(values: number[]): number {
  const nonZero = values.filter((value) => value > 0);
  const minimum = Math.min(...nonZero);
  if (values.length === 2) return Math.max((values[1] - values[0]) / 2, 10 ** -decimalPlaces(String(minimum)));
  if (minimum < 1) return 0.1;
  if (minimum < 10) return values.some((value) => !Number.isInteger(value)) ? 0.1 : 1;
  if (minimum < 100) return 5;
  return 100;
}

function replaceNumbers(answer: string, values: number[], places: number): string {
  let index = 0;
  return answer.replace(/\d+(?:\.\d+)?/g, () => formatNumber(values[index++] ?? 0, places));
}

/**
 * This is the past-exam blueprint's numeric-neighbor distractor strategy.
 * Each alternative changes only the value of the selected entity's verified
 * standard, so it cannot import a different facility, use type, or axis.
 */
export function buildNumericNeighbors(fact: PlanningNumericFact): string[] {
  const numericTokens = [...fact.numericAnswer.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  const places = Math.max(...numericTokens.map((value) => decimalPlaces(String(value))));
  const step = spacingFor(numericTokens);
  const offsets = [-step, step, step * 2];
  const alternatives = offsets.map((offset) => {
    const shifted = numericTokens.map((value) => Math.max(step / 10, value + offset));
    return replaceNumbers(fact.numericAnswer, shifted, places);
  });
  if (new Set(alternatives).size !== 3 || alternatives.includes(fact.numericAnswer)) {
    throw new Error(`Could not construct three unique numeric neighbors for ${fact.id}.`);
  }
  return alternatives;
}

export function generatePlanningNumericChoice(
  facts: PlanningNumericFact[],
  seed: number,
): PlanningNumericChoiceQuestion {
  if (facts.length < 1) {
    throw new Error("Planning numeric generator requires at least one eligible Atomic Fact.");
  }

  // A balanced seed cycle guarantees that every eligible answer fact is reachable.
  const ordered = [...facts].sort((a, b) => a.id.localeCompare(b.id));
  const answer = ordered[(seed >>> 0) % ordered.length];
  const distractors = buildNumericNeighbors(answer);
  const optionRecords = shuffled(
    [{ value: answer.numericAnswer, isCorrect: true }, ...distractors.map((value) => ({ value, isCorrect: false }))],
    nextRandom(seed),
  );
  const options = optionRecords.map((option) => option.value);
  const correctIndex = optionRecords.findIndex((option) => option.isCorrect);
  if (new Set(options).size !== 4 || correctIndex < 0) {
    throw new Error(`Planning numeric generator produced non-unique options for ${answer.id}.`);
  }

  return {
    id: `planning-number-four-choice-${seed >>> 0}`,
    classification: "atomic_fact_generator",
    templateId: "number_four_choice",
    sourceFactId: answer.id,
    distractorFactIds: [],
    prompt: `\u300c${answer.entityName}\u300d\u306b\u3064\u3044\u3066\u3001\u6700\u3082\u9069\u5207\u306a\u6570\u5024\u3092\u4e00\u3064\u9078\u3073\u306a\u3055\u3044\u3002`,
    options,
    correctIndex,
    correctAnswer: answer.numericAnswer,
    explanation: `\u300c${answer.entityName}\u300d\u306e\u57fa\u6e96\u5024\u306f ${answer.numericAnswer}\u3002\u4ed6\u306e\u9078\u629e\u80a2\u306f\u3001\u540c\u4e00\u306e\u57fa\u6e96\u5024\u3092\u5909\u66f4\u3057\u305f\u6570\u5024\u8fd1\u50cd\u5024\u3067\u3042\u308a\u3001\u5225\u306e\u65bd\u8a2d\u30fb\u7528\u9014\u30fb\u6307\u6a19\u8ef8\u306e\u4e8b\u5b9f\u306f\u6df7\u5165\u3057\u306a\u3044\u3002`,
    relation: "standard_value",
    compatibilityGroup: `${answer.numericUnit}|${answer.answerKind}|self`,
    distractorMode: "numeric_neighbor_from_answer_fact",
    distractorEvidence: distractors.map((option) => ({
      option,
      answerFactId: answer.id,
      relation: "standard_value",
      reason: `The Atomic Fact fixes ${answer.entityName}'s ${answer.numericAnswer}; ${option} is a different value for that same entity and relation.`,
    })),
  };
}
