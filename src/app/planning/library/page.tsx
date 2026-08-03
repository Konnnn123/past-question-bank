import PlanningLibraryClient from "./PlanningLibraryClient";
import { getPlanningLibraryData } from "@/lib/planning-library-data";

export default function PlanningLibraryPage() {
  return <PlanningLibraryClient {...getPlanningLibraryData()} surface="library" />;
}

