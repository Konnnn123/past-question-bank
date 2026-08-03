import fs from "fs";
import path from "path";
import EnvCalcClient from "./EnvCalcClient";
import type { EnvironmentFormulaFact } from "@/lib/environment-formula-choice-generator";
import type { EnvironmentPhenomenonFact } from "@/lib/environment-phenomenon-wordbank-generator";
import type { EnvironmentCorrectStatementFact } from "@/lib/environment-correct-statement-generator";
import type { EnvironmentRuntimeBlueprint } from "@/lib/environment-runtime-mock";
import blueprint from "../../../../../data/environment-full-exam-blueprint.json";

interface ProductionQuestion {
  id: string; subject: string; format: string; familyId: string;
  prompt: string; correctAnswer: string; workedSolution: string;
  assumptions: string[]; examRef: string; reasoningSteps: number;
  fidelityAudit?: { structuralSimilarity: number; action: string };
}

export default function EnvCalcPage() {
  const prodPath = path.join(process.cwd(), "data/environment-calculation-pilot.json");
  let questions: ProductionQuestion[] = [];
  let formulaFacts: EnvironmentFormulaFact[] = [];
  let phenomenonFacts: EnvironmentPhenomenonFact[] = [];
  let correctStatementFacts: EnvironmentCorrectStatementFact[] = [];
  if (fs.existsSync(prodPath)) {
    questions = JSON.parse(fs.readFileSync(prodPath, "utf-8")).questions ?? [];
  }
  const atomicPath = path.join(process.cwd(), "data", "atomic-facts.json");
  if (fs.existsSync(atomicPath)) {
    formulaFacts = (JSON.parse(fs.readFileSync(atomicPath, "utf-8")).facts ?? []) as EnvironmentFormulaFact[];
  }
  const phenomenonPath = path.join(process.cwd(), "data", "environment-phenomenon-approved-facts.json");
  if (fs.existsSync(phenomenonPath)) phenomenonFacts = JSON.parse(fs.readFileSync(phenomenonPath, "utf-8")).facts ?? [];
  const correctStatementPath = path.join(process.cwd(), "data", "environment-correct-statement-approved-propositions.json");
  if (fs.existsSync(correctStatementPath)) correctStatementFacts = JSON.parse(fs.readFileSync(correctStatementPath, "utf-8")).propositions ?? [];
  const runtimeBlueprint: EnvironmentRuntimeBlueprint = { formulaChoiceCount: 0, includePhenomenonWordBank: false, includeCorrectStatement: false };
  return <EnvCalcClient questions={questions} formulaFacts={formulaFacts} phenomenonFacts={phenomenonFacts} correctStatementFacts={correctStatementFacts} runtimeBlueprint={runtimeBlueprint} blueprintLabel={blueprint.id} />;
}
