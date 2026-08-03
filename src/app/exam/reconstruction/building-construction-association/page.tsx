import fs from "fs";
import path from "path";
import BuildingConstructionAssociationClient from "../../mock/building-construction-association/BuildingConstructionAssociationClient";

export default function Page() {
  const dataPath = path.join(process.cwd(), "data/building-construction-semantic-association-prototype.json");
  const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, "utf-8")) : { sets: [], notice: "Data unavailable." };
  return <BuildingConstructionAssociationClient sets={data.sets ?? []} notice={data.notice ?? ""} />;
}
