import fs from "fs";
import path from "path";
import ArchitectureCardsClient from "./ArchitectureCardsClient";

export default async function ArchitectureCardsPage() {
  // Load old-to-new building name mapping
  let buildingCardMap: Record<string, { buildingId: string; learningCardIds: string[] }> = {};
  const mapPath = path.join(process.cwd(), "data/old-building-name-map.json");
  if (fs.existsSync(mapPath)) {
    buildingCardMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
  }

  return <ArchitectureCardsClient buildingCardMap={buildingCardMap} />;
}
