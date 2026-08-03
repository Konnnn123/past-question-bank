import fs from "fs";
import { assembleBuildingConstructionMock, type MockData } from "../src/lib/building-construction-mock";

const read = <T>(file: string) => JSON.parse(fs.readFileSync(file, "utf8")) as T;
const normal = (value: string) => value.toLowerCase().replace(/[\s、・／/()（）]/g, "");
function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

type ChoiceQuestion = { id: string; subject: string; options: string[]; correctIndex: number; correctAnswer: string; sourceFactId?: string; examRef?: string };
function validateChoiceSet(name: string, questions: ChoiceQuestion[]) {
  assert(questions.length > 0, `${name}: empty question set`);
  assert(new Set(questions.map((question) => question.id)).size === questions.length, `${name}: duplicate question id`);
  for (const question of questions) {
    assert(question.options.length >= 2, `${name}:${question.id}: too few options`);
    assert(new Set(question.options).size === question.options.length, `${name}:${question.id}: duplicate options`);
    assert(question.options[question.correctIndex].replace(/^[A-D][.．]\s*/, "") === question.correctAnswer, `${name}:${question.id}: answer/index mismatch`);
    assert(Boolean(question.sourceFactId || question.examRef), `${name}:${question.id}: missing source trace`);
  }
}

const environment = read<{ questions: Array<ChoiceQuestion & { validation: { passed: boolean }; workedSolution: string }> }>("data/environment-calculation-pilot.json");
assert(environment.questions.length === 12, "environment: expected 12 pilot questions");
assert(new Set(environment.questions.map((question) => question.id)).size === environment.questions.length, "environment: duplicate question id");
for (const question of environment.questions) {
  assert(question.validation.passed && Boolean(question.correctAnswer) && Boolean(question.workedSolution), `environment:${question.id}: invalid calculation record`);
}

const correctStatements = read<{ questions: ChoiceQuestion[] }>("data/correct-statement-prototypes.json");
assert(correctStatements.questions.length === 10 && correctStatements.questions.every((question) => question.options[question.correctIndex] === question.correctAnswer), "environment correct-statement prototype is structurally invalid");

const planningNumeric = read<{ questions: ChoiceQuestion[] }>("data/planning-numeric-pilot.json");
validateChoiceSet("planning_numeric", planningNumeric.questions);
const planningFacility = read<{ questions: ChoiceQuestion[] }>("data/planning-facility-pilot.json");
validateChoiceSet("planning_facility", planningFacility.questions);

const history = read<{ images: Array<{ assetId: string; webPath: string; buildingName: string; architect: string; style: string }>; wordBanks: Record<string, { terms: string[] }>; correctMapping: Record<string, { bankA_term: string; bankB_term: string; bankC_term: string }>; validation: Record<string, boolean> }>("data/history-mwb-prototype.json");
assert(Object.values(history.validation).every(Boolean) && history.images.length === 6, "history: image prototype is invalid");
for (const image of history.images) {
  assert(Boolean(image.assetId && image.webPath && image.buildingName && image.architect && image.style), `history:${image.assetId}: incomplete source mapping`);
  assert(fs.existsSync(`public${image.webPath}`), `history:${image.assetId}: missing image asset`);
}
for (const mapping of Object.values(history.correctMapping)) {
  assert(history.wordBanks.A_building_names.terms.includes(mapping.bankA_term), "history: building answer absent from bank");
  assert(history.wordBanks.B_architects.terms.includes(mapping.bankB_term), "history: architect answer absent from bank");
  assert(history.wordBanks.C_styles.terms.includes(mapping.bankC_term), "history: style answer absent from bank");
}

const constructionNumeric = read<{ questions: ChoiceQuestion[]; validation: { excludesStructuralMechanics: boolean; allWorkedSolutionsPresent: boolean } }>("data/building-construction-numerical-pilot.json");
validateChoiceSet("building_construction_numerical", constructionNumeric.questions);
assert(constructionNumeric.validation.excludesStructuralMechanics && constructionNumeric.validation.allWorkedSolutionsPresent, "building construction numerical: scope or solution gate failed");

const shared = read<MockData["shared"]>("data/building-construction-shared-wordbank-generated-v1.json");
const formatSource = read<{ families: MockData["formats"] }>("data/building-construction-production-formats-v1.json");
const numerical = read<{ questions: Array<{ id: string; prompt: string; correctAnswer: string; options: string[]; correctIndex: number }> }>("data/building-construction-numerical-pilot.json");
const fullData: MockData = { shared, formats: formatSource.families, numeric: numerical.questions };
for (let seed = 1; seed <= 100; seed += 1) {
  const blocks = assembleBuildingConstructionMock(fullData, seed);
  const objective = blocks.flatMap((block) => block.mode === "written" ? [] : block.items).filter((item) => item.answer);
  const written = blocks.find((block) => block.mode === "written")?.items ?? [];
  assert(blocks.length === 7, `full mock seed ${seed}: expected seven blocks`);
  assert(objective.length === 48, `full mock seed ${seed}: expected 48 objective items`);
  assert(written.length === 3 && written.every((item) => (item.rubric?.length ?? 0) >= 2), `full mock seed ${seed}: rubric block invalid`);
  assert(new Set(objective.map((item) => item.id)).size === objective.length, `full mock seed ${seed}: duplicate item id`);
  assert(new Set(objective.map((item) => normal(item.answer ?? ""))).size === objective.length, `full mock seed ${seed}: duplicate objective answer`);
  for (const item of objective) {
    if (item.choices) assert(item.choices.includes(item.answer ?? ""), `full mock seed ${seed}:${item.id}: answer absent from choices`);
    assert(Boolean(item.answer), `full mock seed ${seed}:${item.id}: missing answer`);
  }
}
assert(JSON.stringify(assembleBuildingConstructionMock(fullData, 77)) === JSON.stringify(assembleBuildingConstructionMock(fullData, 77)), "full mock: same seed is not reproducible");

console.log(JSON.stringify({
  decision: "pass",
  validated: {
    environmentCalculation: environment.questions.length,
    deferredEnvironmentCorrectStatementPrototype: correctStatements.questions.length,
    planningNumeric: planningNumeric.questions.length,
    planningFacility: planningFacility.questions.length,
    historyImages: history.images.length,
    buildingConstructionNumerical: constructionNumeric.questions.length,
    buildingConstructionFullMockSeeds: 100
  },
  gates: { objectiveAnswersUnique: "pass", objectiveAnswersAutoGradable: "pass", writtenRubrics: "pass", sourceTraceability: "pass", fullMockReproducibility: "pass", structuralMechanicsExcluded: "pass" }
}, null, 2));
