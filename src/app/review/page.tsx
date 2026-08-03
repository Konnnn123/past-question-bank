import { getAllQuestions } from "@/lib/data";
import ReviewClient from "./ReviewClient";

export default async function ReviewPage() {
  const questions = await getAllQuestions();
  return <ReviewClient questions={questions} />;
}
