import fs from "fs"; import path from "path";
import ConstructionClient from "./ConstructionClient";

export default function Page() {
  const p = path.join(process.cwd(), "data/construction-fb-prototype.json");
  const data = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : {};
  return <ConstructionClient data={data} />;
}
