import fs from "fs";
import path from "path";
import GeneratedRCAssociationClient from "./GeneratedRCAssociationClient";

export default function Page() {
  const dataPath = path.join(process.cwd(), "data/building-construction-rc-association-generated-v1.json");
  const data = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, "utf-8")) : { items: [], wordBank: [] };
  return <GeneratedRCAssociationClient data={data} />;
}
