import { getAllQuestions } from "@/lib/data";
import { getPlanningAnswerRecords } from "@/lib/planning-review";
import { getConstructionAnswerRecords } from "@/lib/construction-review";
import { buildLightPracticeQuestions } from "@/lib/light-practice";
import { annotatePracticeOriginalLanguage } from "@/lib/practice-original-language";
import LightPracticeClient from "./LightPracticeClient";

export default async function LightPracticePage() {
  const questions = await getAllQuestions();
  const items = buildLightPracticeQuestions(questions, getPlanningAnswerRecords(), getConstructionAnswerRecords()).map((item) => ({
    ...item,
    prompt: annotatePracticeOriginalLanguage(item.prompt),
    answer: annotatePracticeOriginalLanguage(item.answer),
  }));
  return <LightPracticeClient questions={items} />;
}
