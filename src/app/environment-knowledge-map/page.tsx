import fs from "fs";
import path from "path";
import EnvironmentKnowledgeMapClient from "./EnvironmentKnowledgeMapClient";

export default async function EnvironmentKnowledgeMapPage() {
  const filePath = path.resolve(
    process.cwd(),
    "data/建築環境工学_知識地図.md"
  );
  const content = fs.readFileSync(filePath, "utf-8");

  return <EnvironmentKnowledgeMapClient content={content} />;
}
