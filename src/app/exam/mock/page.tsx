import { getAllQuestions } from "@/lib/data";
import { getPlanningAnswerRecords } from "@/lib/planning-review";
import { getConstructionAnswerRecords } from "@/lib/construction-review";
import { buildLightPracticeQuestions } from "@/lib/light-practice";
import MockExamClient from "./MockExamClient";

export default async function MockExamPage() {
  const questions = await getAllQuestions();
  const units = buildLightPracticeQuestions(questions, getPlanningAnswerRecords(), getConstructionAnswerRecords());

  return <MockExamClient units={units} />;
}
