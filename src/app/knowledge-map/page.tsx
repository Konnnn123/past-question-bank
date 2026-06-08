import fs from "fs";
import path from "path";
import { getAllQuestions } from "@/lib/data";
import KnowledgeMapClient from "./KnowledgeMapClient";

export default async function KnowledgeMapPage() {
  const filePath = path.resolve(
    process.cwd(),
    "data/構造力学_知識地図.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");
  const questions = await getAllQuestions();

  return <KnowledgeMapClient content={content} questions={questions} />;
}
