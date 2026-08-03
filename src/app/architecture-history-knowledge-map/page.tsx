import { getAllQuestions } from "@/lib/data";
import ArchitectureHistoryKnowledgeMapClient from "./ArchitectureHistoryKnowledgeMapClient";

export default async function ArchitectureHistoryKnowledgeMapPage() {
  const questions = await getAllQuestions();
  return <ArchitectureHistoryKnowledgeMapClient questions={questions} />;
}
