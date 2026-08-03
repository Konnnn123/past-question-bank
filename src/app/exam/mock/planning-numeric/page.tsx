import fs from "fs"; import path from "path";
import PlanningNumericClient from "./PlanningNumericClient";
import { getEligiblePlanningNumericFacts } from "@/lib/planning-numeric-choice-eligibility";

export default function Page() {
  const p = path.join(process.cwd(), "data/planning-numeric-pilot.json");
  const questions = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")).questions ?? [] : [];
  return <PlanningNumericClient questions={questions} eligibleFacts={getEligiblePlanningNumericFacts()} />;
}
