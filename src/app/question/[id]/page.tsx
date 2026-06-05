import { getAllQuestions } from "@/lib/data";
import QuestionDetailClient from "./QuestionDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionDetail({ params }: PageProps) {
  const { id } = await params;
  const questions = await getAllQuestions();
  const questionIndex = Number(id);
  const question = questions[questionIndex];

  return (
    <QuestionDetailClient
      question={question}
      questionIndex={questionIndex}
      totalQuestions={questions.length}
    />
  );
}
