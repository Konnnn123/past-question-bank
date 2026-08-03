import fs from "fs";
import path from "path";
import { createQuestionId, getAllQuestions } from "@/lib/data";
import QuestionDetailClient from "./QuestionDetailClient";
import { getQuestionAnswerRecord } from "@/lib/question-answers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const processedDir = path.resolve(process.cwd(), "data/processed_questions");
  if (!fs.existsSync(processedDir)) {
    return [];
  }
  const files = fs.readdirSync(processedDir).filter((f) => f.endsWith(".md"));
  return files.map((file) => ({ id: createQuestionId(file) }));
}

export default async function QuestionDetail({ params }: PageProps) {
  const { id } = await params;
  const questions = await getAllQuestions();
  const questionIndex = questions.findIndex((question) => question.id === id);
  const question = questionIndex >= 0 ? questions[questionIndex] : undefined;
  const answerRecord = question
    ? getQuestionAnswerRecord(question.fileName)
    : undefined;

  return (
    <QuestionDetailClient
      question={question}
      questionIndex={questionIndex}
      totalQuestions={questions.length}
      previousQuestionId={questionIndex > 0 ? questions[questionIndex - 1].id : undefined}
      nextQuestionId={questionIndex >= 0 && questionIndex < questions.length - 1 ? questions[questionIndex + 1].id : undefined}
      answerRecord={answerRecord}
    />
  );
}
