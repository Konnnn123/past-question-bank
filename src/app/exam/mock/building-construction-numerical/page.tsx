import fs from "fs";
import path from "path";
import BuildingConstructionNumericalClient from "./BuildingConstructionNumericalClient";

export default function Page() {
  const dataPath = path.join(process.cwd(), "data/building-construction-numerical-pilot.json");
  const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, "utf-8")) : { questions: [] };
  return <BuildingConstructionNumericalClient questions={data.questions ?? []} />;
}
