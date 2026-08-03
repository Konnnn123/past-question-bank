import { getAssessmentDrafts } from "@/lib/assessment-drafts";
import { annotatePracticeOriginalLanguage } from "@/lib/practice-original-language";

// This deliberately lives on a separate static page. The main light-practice
// page starts with past questions only, so its initial document stays small.
export default function LightPracticeSimulationsPage() {
  const drafts = getAssessmentDrafts().map((draft) => ({
    ...draft,
    prompt: annotatePracticeOriginalLanguage(draft.prompt),
    answer: annotatePracticeOriginalLanguage(draft.answer),
  }));

  return <pre id="light-practice-simulations">{JSON.stringify(drafts)}</pre>;
}
