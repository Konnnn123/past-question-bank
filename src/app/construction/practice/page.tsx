import ConstructionLibraryClient from "../library/ConstructionLibraryClient";
import { getConstructionLibraryData } from "@/lib/construction-library-data";

export default function ConstructionPracticePage() {
  return <ConstructionLibraryClient {...getConstructionLibraryData()} surface="practice" />;
}
