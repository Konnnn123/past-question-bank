import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const timelinePath = path.resolve("src/lib/timeline-data.ts");
const source = fs.readFileSync(timelinePath, "utf8");
const file = ts.createSourceFile(timelinePath, source, ts.ScriptTarget.Latest, true);
const linkedBuildings = JSON.parse(fs.readFileSync("data/building-learning-card-links.json", "utf8")).buildings;
const normalizedBuildings = JSON.parse(fs.readFileSync("data/architecture-normalized-candidates.json", "utf8")).buildings;
const linkedIds = new Set(linkedBuildings.map((building) => building.buildingId));
const normalizedById = new Map(normalizedBuildings.map((building) => [building.id, building]));
const issues = [];
const placements = new Map();

const expectedAncientJapanesePlacements = new Map([
  ["building-db665061135f", "ancient-2500bce"], // 三内丸山遺跡 — 縄文
  ["building-d511f92a9b59", "ancient-5c-bce"], // 池上・曽根遺跡 — 弥生
  ["building-28264369db88", "ancient-1c-ce"], // 松野遺跡 — 弥生～古墳
  ["building-2b783a82e2f9", "ancient-1c-ce"], // 吉野ヶ里遺跡 — 弥生
]);

function propertyName(property) {
  return ts.isPropertyAssignment(property) && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
    ? property.name.text
    : null;
}

function stringProperty(object, name) {
  const property = object.properties.find((item) => propertyName(item) === name);
  return property && ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer)
    ? property.initializer.text
    : null;
}

function stringArrayProperty(object, name) {
  const property = object.properties.find((item) => propertyName(item) === name);
  if (!property || !ts.isPropertyAssignment(property) || !ts.isArrayLiteralExpression(property.initializer)) return null;
  return property.initializer.elements.filter(ts.isStringLiteral).map((item) => item.text);
}

function inspect(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const id = stringProperty(node, "id");
    const year = stringProperty(node, "year");
    const relatedCardIds = stringArrayProperty(node, "relatedCardIds");
    if (id && year && relatedCardIds) {
      const buildingIds = stringArrayProperty(node, "buildingIds");
      if (!buildingIds?.length) {
        issues.push(`${id}: buildingIds must explicitly define representative buildings`);
      } else {
        const uniqueIds = new Set(buildingIds);
        if (uniqueIds.size !== buildingIds.length) issues.push(`${id}: buildingIds contains duplicates`);
        for (const buildingId of uniqueIds) {
          if (!linkedIds.has(buildingId)) issues.push(`${id}: ${buildingId} is absent from building-learning-card-links.json`);
          const building = normalizedById.get(buildingId);
          if (!building) issues.push(`${id}: ${buildingId} is absent from architecture-normalized-candidates.json`);
          else if (!building.period?.ja?.trim()) issues.push(`${id}: ${buildingId} has no Japanese period label`);
          const placedIn = placements.get(buildingId) ?? [];
          placedIn.push(id);
          placements.set(buildingId, placedIn);
        }
      }
    }
  }
  node.forEachChild(inspect);
}

inspect(file);

for (const [buildingId, expectedNode] of expectedAncientJapanesePlacements) {
  const actualNodes = placements.get(buildingId) ?? [];
  if (actualNodes.length !== 1 || actualNodes[0] !== expectedNode) {
    issues.push(`${buildingId}: expected only in ${expectedNode}, found ${actualNodes.join(", ") || "nowhere"}`);
  }
}

console.log(`Timeline placement issues: ${issues.length}`);
for (const issue of issues) console.log(issue);
if (issues.length > 0) process.exitCode = 1;
