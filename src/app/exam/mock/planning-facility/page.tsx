import PlanningFacilityClient from "./PlanningFacilityClient";
import { generatePlanningFacilityChoice, getEligiblePlanningFacilityFacts } from "@/lib/planning-facility-choice-generator";

export default function Page() {
  const facts = getEligiblePlanningFacilityFacts();
  const questions = Array.from({ length: 12 }, (_, index) => {
    const generated = generatePlanningFacilityChoice(facts, index + 1);
    return {
      ...generated,
      topic: generated.compatibilityGroup,
      explanation: `Atomic Fact: ${generated.sourceFactId}. ${generated.distractorEvidence.map((evidence) => evidence.reason).join(" ")}`,
      scores: { technicalAccuracy: 5, distractorQuality: 5, examFidelity: 5 },
    };
  });
  return <PlanningFacilityClient questions={questions} />;
}
