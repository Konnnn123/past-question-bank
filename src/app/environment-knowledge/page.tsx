import EnvironmentKnowledgeClient from "./EnvironmentKnowledgeClient";
import { getAllQuestions } from "@/lib/data";

export default async function EnvironmentKnowledgePage() {
  const questions = await getAllQuestions();
  return <EnvironmentKnowledgeClient questions={questions} />;
}
