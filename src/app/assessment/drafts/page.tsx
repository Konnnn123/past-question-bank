import { getAssessmentDrafts } from "@/lib/assessment-drafts";
import DraftWorkbenchClient from "./DraftWorkbenchClient";

export default function AssessmentDraftsPage() {
  return <DraftWorkbenchClient drafts={getAssessmentDrafts()} />;
}
