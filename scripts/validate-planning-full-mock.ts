import { getAllQuestions } from "../src/lib/data";
import { buildLightPracticeQuestions } from "../src/lib/light-practice";
import { getPlanningAnswerRecords } from "../src/lib/planning-review";
import { assemblePlanningFullMock, type PlanningFullMockData } from "../src/lib/planning-full-mock";
import blueprint from "../data/planning-full-exam-blueprint.json";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  const questions = await getAllQuestions();
  const records = getPlanningAnswerRecords();
  const lightItems = buildLightPracticeQuestions(questions, records, []);
  const planningSourceIds = new Set(questions.filter((question) => records.some((record) => record.fileName === question.fileName)).map((question) => question.id));
  const planningItems = lightItems.filter((item) => item.sourceQuestionId && planningSourceIds.has(item.sourceQuestionId));
  const groups = records.map((record) => {
    const question = questions.find((candidate) => candidate.fileName === record.fileName);
    return {
      sourceFile: record.fileName,
      items: planningItems.filter((item) => item.sourceQuestionId === question?.id).map((item) => ({
        id: item.id,
        prompt: item.prompt,
        answer: item.answer.replace(/^[A-D][.．]\s*/, ""),
        sourceFile: record.fileName,
        sourceLocation: item.label,
        sourceType: "past_exam_reconstruction" as const,
      })),
    };
  });
  const data: PlanningFullMockData = { pastPaperGroups: groups };
  assert(groups.filter((group) => group.items.length === 20).length >= 1, "No complete 20-item Specialist 1 planning reconstruction group.");
  for (let seed = 1; seed <= 100; seed += 1) {
    const items = assemblePlanningFullMock(data, seed);
    assert(items.length === blueprint.total_scoring_units, `Seed ${seed}: blueprint count mismatch.`);
    assert(new Set(items.map((item) => item.id)).size === blueprint.total_scoring_units, `Seed ${seed}: duplicate item id.`);
    assert(new Set(items.map((item) => item.answer.trim().toLowerCase().replace(/\s+/g, " "))).size === blueprint.total_scoring_units, `Seed ${seed}: duplicate answer fact.`);
    assert(items.every((item) => item.sourceFile && item.sourceLocation), `Seed ${seed}: missing traceability.`);
    assert(items.every((item) => item.sourceType === "past_exam_reconstruction"), `Seed ${seed}: non-reconstruction item leaked into past-paper practice.`);
  }
  assert(JSON.stringify(assemblePlanningFullMock(data, 27)) === JSON.stringify(assemblePlanningFullMock(data, 27)), "Same seed is not reproducible.");
  console.log(JSON.stringify({ decision: "pass", seeds: 100, itemsPerPaper: blueprint.total_scoring_units, reconstructionItems: 20, mode: "past_exam_reconstruction", sameSeedReproducible: true }, null, 2));
}

main();
