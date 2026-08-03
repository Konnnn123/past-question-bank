import { getAllQuestions } from "@/lib/data";
import { getConstructionAnswerRecords } from "@/lib/construction-review";
import ConstructionMethodsKnowledgeMapClient from "./ConstructionMethodsKnowledgeMapClient";
import approvedSlots from "../../../data/construction-2024-q3-slot-review.json";

export default async function ConstructionMethodsKnowledgeMapPage() {
  const [questions, answerRecords] = await Promise.all([
    getAllQuestions(),
    Promise.resolve(getConstructionAnswerRecords()),
  ]);

  return (
    <ConstructionMethodsKnowledgeMapClient
      questions={questions}
      answerRecords={answerRecords}
      approvedChoiceSlots={approvedSlots.slots}
    />
  );
}
