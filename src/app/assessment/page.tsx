import { getAllQuestions } from "@/lib/data";
import { getPlanningAnswerRecords } from "@/lib/planning-review";
import { getConstructionAnswerRecords } from "@/lib/construction-review";
import { buildLightPracticeQuestions } from "@/lib/light-practice";
import { getAnkiKnowledgeCoverage, getEnvironmentKnowledgeCoverage, getPlanningKnowledgeCoverage } from "@/lib/knowledge-coverage";
import AssessmentClient from "./AssessmentClient";
import { getAssessmentDrafts } from "@/lib/assessment-drafts";

export default async function AssessmentPage() {
  const questions = await getAllQuestions();
  const units = buildLightPracticeQuestions(questions, getPlanningAnswerRecords(), getConstructionAnswerRecords());
  const ankiCoverage = getAnkiKnowledgeCoverage(units);
  const constructionDrafts = getAssessmentDrafts().filter((draft) => draft.subject === "建筑构法");
  return <AssessmentClient units={units} ankiCoverage={ankiCoverage} planningCoverage={getPlanningKnowledgeCoverage()} environmentCoverage={getEnvironmentKnowledgeCoverage(units)} constructionDrafts={constructionDrafts} />;
}
