import { getAllQuestions } from "@/lib/data";
import { getPlanningAnswerRecords } from "@/lib/planning-review";
import { buildLightPracticeQuestions } from "@/lib/light-practice";
import type { PlanningFullMockData, PlanningObjectiveItem } from "@/lib/planning-full-mock";
import PlanningFullMockClient from "./PlanningFullMockClient";
import blueprint from "../../../../../data/planning-full-exam-blueprint.json";

export default async function PlanningFullMockPage() {
  const questions = await getAllQuestions();
  const records = getPlanningAnswerRecords();
  const lightItems = buildLightPracticeQuestions(questions, records, []);
  const sourceById = new Map(questions.map((question) => [question.id, question.fileName]));
  const planningSourceIds = new Set(questions.filter((question) => records.some((record) => record.fileName === question.fileName)).map((question) => question.id));
  const planningItems = lightItems.filter((item) => item.sourceQuestionId && planningSourceIds.has(item.sourceQuestionId));
  const pastPaperGroups = records.map((record) => {
    const items: PlanningObjectiveItem[] = planningItems
      .filter((item) => item.sourceQuestionId === questions.find((question) => question.fileName === record.fileName)?.id)
      .map((item) => ({
        id: item.id,
        prompt: item.prompt,
        answer: item.answer.replace(/^[A-D][.．]\s*/, ""),
        sourceFile: sourceById.get(item.sourceQuestionId ?? "") ?? record.fileName,
        sourceLocation: item.label,
        sourceType: "past_exam_reconstruction" as const,
      }));
    return { sourceFile: record.fileName, items };
  });
  const data: PlanningFullMockData = {
    pastPaperGroups,
  };
  return <PlanningFullMockClient data={data} />;
}
