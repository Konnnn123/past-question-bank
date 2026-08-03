import { notFound } from "next/navigation";
import { CURRENT_TOPICS, getCurrentTopic } from "@/lib/current-topics";
import { createQuestionId } from "@/lib/data";
import CurrentTopicDetailClient from "./CurrentTopicDetailClient";

export function generateStaticParams() {
  return CURRENT_TOPICS.map((topic) => ({ id: topic.id }));
}

export default async function CurrentTopicDetailPage({ params }: PageProps<"/current-topics/[id]">) {
  const { id } = await params;
  const topic = getCurrentTopic(id);
  if (!topic) notFound();
  const questionIds = Object.fromEntries(
    topic.pastQuestions.map((question) => [question.fileName, createQuestionId(question.fileName)]),
  );
  return <CurrentTopicDetailClient topicId={id} questionIds={questionIds} />;
}
