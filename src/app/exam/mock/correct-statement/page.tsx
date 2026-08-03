import fs from "fs"; import path from "path";
import CorrectStatementClient from "./CorrectStatementClient";

export default function Page() {
  const p = path.join(process.cwd(), "data/correct-statement-prototypes.json");
  const questions = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")).questions ?? [] : [];
  return <CorrectStatementClient questions={questions} />;
}
