import { getAllQuestions } from "@/lib/data";
import { getPlanningAnswerRecords } from "@/lib/planning-review";
import PlanningKnowledgeMapClient from "./PlanningKnowledgeMapClient";

export default async function PlanningKnowledgeMapPage() {
  const [questions, answerRecords] = await Promise.all([
    getAllQuestions(),
    Promise.resolve(getPlanningAnswerRecords()),
  ]);

  return <PlanningKnowledgeMapClient questions={questions} answerRecords={answerRecords} />;
}
