import fs from "fs";
import path from "path";
import AuditClient from "./AuditClient";

interface AuditQuestion {
  id: string; subject: string; blueprintId: string;
  technicalQuality: number; pedagogicalQuality: number;
  question: {
    prompt: string; options: string[]; correctIndex: number; answerExplanation: string;
  };
  traceability: {
    originalSource?: string; originalField?: string; extractedFacts?: string[];
    confidence?: string;
    // Round 2 fix traceability
    roleFixed?: string; distractorRule?: string; round1Issue?: string; fixApplied?: string;
    styleAxisFixed?: string; useType?: string; analysisAxis?: string;
    definitionCleaned?: string; domain?: string; expressionType?: string;
  };
}

export default function AuditPage() {
  // Round 3B sample (contract-enforced + peer-scored)
  const samplePath = path.join(process.cwd(), "data/audit-round3b-questions.json");
  let questions: AuditQuestion[] = [];
  if (fs.existsSync(samplePath)) {
    const raw = JSON.parse(fs.readFileSync(samplePath, "utf-8"));
    questions = raw.questions ?? [];
  }

  // Fallback to round 1
  if (!questions.length) {
    const r1Path = path.join(process.cwd(), "data/question-audit-sample.json");
    if (fs.existsSync(r1Path)) {
      questions = JSON.parse(fs.readFileSync(r1Path, "utf-8")).questions ?? [];
    }
  }

  const bySubject: Record<string, number> = {};
  for (const q of questions) {
    bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
  }

  return <AuditClient questions={questions} bySubject={bySubject} />;
}
