import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const timelinePath = path.resolve("src/lib/timeline-data.ts");
const timelineSource = fs.readFileSync(timelinePath, "utf8");
const timelineFile = ts.createSourceFile(timelinePath, timelineSource, ts.ScriptTarget.Latest, true);
const cjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const issues = [];

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

function report(id, field, message) {
  issues.push(`${id}: ${field} ${message}`);
}

function checkNode(node, context = "timeline") {
  if (!ts.isObjectLiteralExpression(node)) {
    node.forEachChild((child) => checkNode(child, context));
    return;
  }

  const id = stringProperty(node, "id") ?? context;
  const names = new Set(node.properties.map(propertyName).filter(Boolean));
  for (const property of node.properties) {
    const name = propertyName(property);
    if (!name) continue;
    const base = name.endsWith("Zh") ? name.slice(0, -2) : name === "zh" && names.has("ja") ? "" : null;
    if (base !== null && !names.has(base ? `${base}En` : "en")) report(id, base || "localized value", "is missing English text");
    if (name.endsWith("En") && ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer) && cjk.test(property.initializer.text)) {
      report(id, name, "contains CJK text");
    }
  }

  const comparison = node.properties.find((property) => propertyName(property) === "comparison");
  if (comparison && ts.isPropertyAssignment(comparison) && ts.isArrayLiteralExpression(comparison.initializer)) {
    const dimensions = new Set();
    for (const row of comparison.initializer.elements) {
      if (!ts.isObjectLiteralExpression(row)) continue;
      for (const field of ["dimensionEn", "westernEn", "eastAsianEn"]) {
        const value = stringProperty(row, field);
        if (!value) report(id, field, "is missing");
        else if (cjk.test(value)) report(id, field, "contains CJK text");
      }
      const dimension = stringProperty(row, "dimensionEn");
      if (dimension && dimensions.has(dimension)) report(id, "comparison", `duplicates the English row label "${dimension}"`);
      if (dimension) dimensions.add(dimension);
    }
  }

  node.forEachChild((child) => checkNode(child, id));
}

const displayedBuildingIds = new Set();
const relatedCardIds = new Set();
function collectTimelineBuildingReferences(node) {
  if (ts.isObjectLiteralExpression(node)) {
    const buildingIds = node.properties.find((property) => propertyName(property) === "buildingIds");
    const cardIds = node.properties.find((property) => propertyName(property) === "relatedCardIds");
    if (buildingIds && ts.isPropertyAssignment(buildingIds) && ts.isArrayLiteralExpression(buildingIds.initializer) && buildingIds.initializer.elements.length > 0) {
      for (const item of buildingIds.initializer.elements) if (ts.isStringLiteral(item)) displayedBuildingIds.add(item.text);
    } else if (cardIds && ts.isPropertyAssignment(cardIds) && ts.isArrayLiteralExpression(cardIds.initializer)) {
      for (const item of cardIds.initializer.elements) if (ts.isStringLiteral(item)) relatedCardIds.add(item.text);
    }
  }
  node.forEachChild(collectTimelineBuildingReferences);
}

checkNode(timelineFile);
collectTimelineBuildingReferences(timelineFile);

const imageMap = JSON.parse(fs.readFileSync("data/building-image-map.json", "utf8"));
const imageAssets = JSON.parse(fs.readFileSync("data/image-assets.json", "utf8")).assets;
const pageSource = fs.readFileSync("src/app/timeline/page.tsx", "utf8");
const buildingLinks = JSON.parse(fs.readFileSync("data/building-learning-card-links.json", "utf8")).buildings;
for (const building of buildingLinks) {
  if (building.learningCardIds.some((cardId) => relatedCardIds.has(cardId))) displayedBuildingIds.add(building.buildingId);
}
for (const buildingId of displayedBuildingIds) {
  const entry = imageMap[buildingId];
  if (!entry) continue;
  const hasEnglishOverride = pageSource.includes(`"${buildingId}":`);
  for (const imageFile of entry.imageFiles ?? []) {
    const originalName = imageAssets.find((asset) => asset.fileName === imageFile && asset.originalName?.trim())?.originalName;
    if (!originalName && !hasEnglishOverride) report(buildingId, imageFile, "has no English building name for the caption");
    else if (originalName && cjk.test(originalName) && !hasEnglishOverride) report(buildingId, imageFile, "has CJK text in its English caption source");
  }
}

const detailSource = fs.readFileSync("src/app/timeline/EraComparisonDetail.tsx", "utf8");
if (!detailSource.includes('lang === "en" ? building.nameEn') || !detailSource.includes("alt={name}")) {
  report("EraComparisonDetail", "building captions", "does not render the localized building name and alt text");
}

console.log(`Timeline English issues: ${issues.length}`);
for (const issue of issues) console.log(issue);
if (issues.length > 0) process.exitCode = 1;
