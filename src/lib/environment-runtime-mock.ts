import { generateVentilationQuestion } from "./environment-ventilation-generator";
import { generateEnvironmentPhenomenonWordBank, type EnvironmentPhenomenonFact } from "./environment-phenomenon-wordbank-generator";
import { generateEnvironmentCorrectStatement, type EnvironmentCorrectStatementFact } from "./environment-correct-statement-generator";
import {
  generateEnvironmentFormulaChoice,
  getEligibleEnvironmentFormulaFacts,
  type EnvironmentFormulaFact,
  type GeneratedEnvironmentFormulaChoice,
} from "./environment-formula-choice-generator";

export type EnvironmentRuntimeMock = {
  seed: number;
  numerical: ReturnType<typeof generateVentilationQuestion>;
  formulaChoices: GeneratedEnvironmentFormulaChoice[];
  classification: {
    numerical: "verified_parameterized_generator";
    formulaChoices: "atomic_fact_generator";
    correctStatement: "atomic_fact_generator";
  };
  phenomenonWordBank?: ReturnType<typeof generateEnvironmentPhenomenonWordBank>;
  correctStatement?: ReturnType<typeof generateEnvironmentCorrectStatement>;
};

export type EnvironmentRuntimeBlueprint = { formulaChoiceCount: number; includePhenomenonWordBank: boolean; includeCorrectStatement: boolean };
export function assembleEnvironmentRuntimeMock(facts: EnvironmentFormulaFact[], seed: number, phenomenonFacts?: EnvironmentPhenomenonFact[], correctStatementFacts?: EnvironmentCorrectStatementFact[], blueprint: EnvironmentRuntimeBlueprint = { formulaChoiceCount: 3, includePhenomenonWordBank: true, includeCorrectStatement: true }): EnvironmentRuntimeMock {
  const eligible = getEligibleEnvironmentFormulaFacts(facts)
    .filter((fact) => fact.entityName !== "CO₂必要換気量");
  const selected: GeneratedEnvironmentFormulaChoice[] = [];
  const usedFactIds = new Set<string>();
  let offset = 0;
  while (selected.length < blueprint.formulaChoiceCount && offset < eligible.length * 3) {
    const question = generateEnvironmentFormulaChoice(eligible, seed + 101 + offset);
    if (!usedFactIds.has(question.sourceFactId)) {
      selected.push(question);
      usedFactIds.add(question.sourceFactId);
    }
    offset += 1;
  }
  if (selected.length !== blueprint.formulaChoiceCount) throw new Error(`environment runtime mock could not select ${blueprint.formulaChoiceCount} distinct formula facts`);
  return {
    seed,
    numerical: generateVentilationQuestion(seed),
    formulaChoices: selected,
    classification: {
      numerical: "verified_parameterized_generator",
      formulaChoices: "atomic_fact_generator",
      correctStatement: "atomic_fact_generator",
    },
    phenomenonWordBank: blueprint.includePhenomenonWordBank && phenomenonFacts ? generateEnvironmentPhenomenonWordBank(phenomenonFacts, seed + 701) : undefined,
    correctStatement: blueprint.includeCorrectStatement && correctStatementFacts ? generateEnvironmentCorrectStatement(correctStatementFacts, seed + 907) : undefined,
  };
}
