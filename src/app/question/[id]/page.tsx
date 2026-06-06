import fs from "fs";
import path from "path";
import { getAllQuestions } from "@/lib/data";
import QuestionDetailClient from "./QuestionDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const processedDir = path.resolve(process.cwd(), "data/processed_questions");
  if (!fs.existsSync(processedDir)) {
    return [];
  }
  const files = fs.readdirSync(processedDir).filter((f) => f.endsWith(".md"));
  return files.map((_, index) => ({ id: String(index) }));
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
