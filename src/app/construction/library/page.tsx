import ConstructionLibraryClient from "./ConstructionLibraryClient";
import { getConstructionLibraryData } from "@/lib/construction-library-data";

export default function ConstructionLibraryPage() {
  return <ConstructionLibraryClient {...getConstructionLibraryData()} surface="library" />;
}
