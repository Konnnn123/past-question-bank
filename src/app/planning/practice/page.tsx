import PlanningLibraryClient from "../library/PlanningLibraryClient";
import { getPlanningLibraryData } from "@/lib/planning-library-data";

export default function PlanningPracticePage() {
  return <PlanningLibraryClient {...getPlanningLibraryData()} surface="practice" />;
}
