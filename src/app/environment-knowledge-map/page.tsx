import { getAllQuestions } from "@/lib/data";
import EnvironmentKnowledgeMapClient from "./EnvironmentKnowledgeMapClient";

export default async function EnvironmentKnowledgeMapPage() {
  const questions = await getAllQuestions();

  return <EnvironmentKnowledgeMapClient questions={questions} />;
}
