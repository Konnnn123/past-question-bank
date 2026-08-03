import { getAllQuestions } from "@/lib/data";
import DashboardClient from "./DashboardClient";

export default async function Home() {
  const questions = await getAllQuestions();
  return <DashboardClient totalQuestions={questions.length} questionIds={questions.map((question) => question.id)} />;
}
