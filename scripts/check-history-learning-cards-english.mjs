import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const cardSources = [
  "history-learning-card-examples.ts", "history-style-cards.ts", "western-style-cards.ts",
  "shrine-style-cards.ts", "supplementary-style-cards.ts", "additional-history-style-cards.ts",
  "building-type-learning-cards.ts", "japanese-special-style-cards.ts", "history-gap-cards.ts",
  "history-movement-cards.ts", "history-architect-cards.ts", "history-architect-cards-western.ts",
  "history-architect-cards-japan.ts", "history-architect-cards-core.ts", "history-architect-cards-batch-two.ts",
  "history-architect-cards-batch-three.ts", "history-architect-cards-batch-four.ts",
  "history-architect-cards-final-audit.ts", "style-evolution-data.ts", "urban-planning-cards.ts",
].map((file) => path.join("src/lib", file));
const pageSource = "src/app/history/HistoryClient.tsx";
const cjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const issues = [];

function report(source, object, field, message) {
  issues.push({ source, object, field, message });
}

function propertyName(node) {
  return ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : null;
}

function enclosingIdentifier(node) {
  let current = node.parent;
  while (current) {
    if (ts.isObjectLiteralExpression(current)) {
      const property = current.properties.find((item) => propertyName(item) === "id");
      if (property && ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer)) return property.initializer.text;
    }
    current = current.parent;
    if (current && ts.isCallExpression(current) && ts.isIdentifier(current.expression)) {
      const candidate = current.arguments[0];
      if (ts.isStringLiteral(candidate) && (current.expression.text === "c" || current.expression.text === "axis")) return candidate.text;
    }
  }
  return "unidentified object";
}

function checkLocalizedCall(node, source, field) {
  if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression) || node.expression.text !== "l") return;
  const object = enclosingIdentifier(node);
  if (node.arguments.length < 3) report(source, object, field, "missing English value");
  const english = node.arguments[2];
  if (english && ts.isStringLiteralLike(english)) {
    if (!english.text.trim()) report(source, object, field, "English value is empty");
    if (cjk.test(english.text)) report(source, object, field, "English value contains CJK text");
  }
}

for (const source of cardSources) {
  const absolute = path.resolve(source);
  const text = fs.readFileSync(absolute, "utf8");
  const file = ts.createSourceFile(absolute, text, ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "l") {
      const parent = node.parent;
      const field = ts.isPropertyAssignment(parent) ? propertyName(parent) ?? "localized value" : "localized value";
      checkLocalizedCall(node, source, field);
    }
    if (source.endsWith("history-movement-cards.ts") && ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "movement") {
      const id = node.arguments[0];
      if (ts.isStringLiteral(id)) {
        const english = node.arguments[16];
        const required = ["name", "period", "summary", "socialBackground", "reactionAgainst", "development", "principles", "results"];
        if (!english || !ts.isObjectLiteralExpression(english)) {
          report(source, id.text, "English movement data", "missing English parameter");
        } else {
          for (const field of required) {
            const property = english.properties.find((item) => propertyName(item) === field);
            if (!property || !ts.isPropertyAssignment(property)) report(source, id.text, field, "missing English value");
          }
        }
      }
    }
    if (source.endsWith("history-architect-cards.ts") && ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "architect") {
      const id = node.arguments[0];
      if (ts.isStringLiteral(id)) {
        const english = node.arguments[14];
        const required = ["name", "period", "summary", "lifeSummary", "designPrinciples", "recurringFeatures", "careerPhases"];
        if (!english || !ts.isObjectLiteralExpression(english)) {
          report(source, id.text, "English architect data", "missing English parameter");
        } else {
          for (const field of required) {
            const property = english.properties.find((item) => propertyName(item) === field);
            if (!property || !ts.isPropertyAssignment(property)) {
              report(source, id.text, field, "missing English value");
              continue;
            }
            if (ts.isStringLiteralLike(property.initializer) && (!property.initializer.text.trim() || cjk.test(property.initializer.text))) {
              report(source, id.text, field, "English value is empty or contains CJK text");
            }
          }
        }
      }
    }
    if (source.endsWith("history-architect-cards-western.ts") && ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "make") {
      const id = node.arguments[0];
      if (ts.isStringLiteral(id)) {
        const english = node.arguments[11];
        const required = ["name", "period", "summary", "designPrinciples", "recurringFeatures", "careerPhases"];
        if (!english || !ts.isObjectLiteralExpression(english)) {
          report(source, id.text, "English western architect data", "missing English parameter");
        } else {
          for (const field of required) {
            const property = english.properties.find((item) => propertyName(item) === field);
            if (!property || !ts.isPropertyAssignment(property)) report(source, id.text, field, "missing English value");
          }
        }
      }
    }
    if (source.endsWith("history-architect-cards-japan.ts") && ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "make") {
      const id = node.arguments[0];
      if (ts.isStringLiteral(id)) {
        const english = node.arguments[11];
        const required = ["name", "period", "summary", "designPrinciples", "recurringFeatures", "careerPhases"];
        if (!english || !ts.isObjectLiteralExpression(english)) report(source, id.text, "English Japanese architect data", "missing English parameter");
        else for (const field of required) {
          const property = english.properties.find((item) => propertyName(item) === field);
          if (!property || !ts.isPropertyAssignment(property)) report(source, id.text, field, "missing English value");
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  if (source.endsWith("history-architect-cards-core.ts")) {
    const findVariableObject = (name) => {
      for (const statement of file.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) return declaration.initializer;
        }
      }
      return null;
    };
    const englishMap = findVariableObject("CORE_ARCHITECT_ENGLISH");
    const ids = new Set();
    const collectIds = (node) => {
      if (ts.isPropertyAssignment(node) && propertyName(node) === "id" && ts.isStringLiteral(node.initializer)) ids.add(node.initializer.text);
      ts.forEachChild(node, collectIds);
    };
    collectIds(file);
    const required = ["name", "summary", "principle", "feature", "phaseDescription"];
    for (const id of ids) {
      const entry = englishMap?.properties.find((item) => propertyName(item) === id);
      if (!entry || !ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) {
        report(source, id, "English core architect data", "missing English mapping");
        continue;
      }
      for (const field of required) {
        const property = entry.initializer.properties.find((item) => propertyName(item) === field);
        if (!property || !ts.isPropertyAssignment(property) || !ts.isStringLiteralLike(property.initializer)) {
          report(source, id, field, "missing English value");
        } else if (!property.initializer.text.trim() || cjk.test(property.initializer.text)) {
          report(source, id, field, "English value is empty or contains CJK text");
        }
      }
    }
  }
  if (source.endsWith("history-architect-cards-batch-two.ts")) {
    const findVariableObject = (name) => {
      for (const statement of file.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) return declaration.initializer;
        }
      }
      return null;
    };
    const englishMap = findVariableObject("BATCH_TWO_ENGLISH");
    const seeds = file.statements.flatMap((statement) => {
      if (!ts.isVariableStatement(statement)) return [];
      return statement.declarationList.declarations.filter((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === "SEEDS" && declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer));
    })[0]?.initializer;
    const required = ["name", "summary", "principle", "feature", "phaseDescription"];
    if (seeds && ts.isArrayLiteralExpression(seeds)) {
      for (const seed of seeds.elements) {
        if (!ts.isArrayLiteralExpression(seed) || !ts.isStringLiteral(seed.elements[0])) continue;
        const id = seed.elements[0].text;
        const entry = englishMap?.properties.find((item) => propertyName(item) === id);
        if (!entry || !ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) {
          report(source, id, "English batch-two architect data", "missing English mapping");
          continue;
        }
        for (const field of required) {
          const property = entry.initializer.properties.find((item) => propertyName(item) === field);
          if (!property || !ts.isPropertyAssignment(property) || !ts.isStringLiteralLike(property.initializer)) {
            report(source, id, field, "missing English value");
          } else if (!property.initializer.text.trim() || cjk.test(property.initializer.text)) {
            report(source, id, field, "English value is empty or contains CJK text");
          }
        }
      }
    }
  }
  if (source.endsWith("history-architect-cards-batch-three.ts")) {
    const findVariableObject = (name) => {
      for (const statement of file.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) return declaration.initializer;
        }
      }
      return null;
    };
    const englishMap = findVariableObject("BATCH_THREE_ENGLISH");
    const seeds = file.statements.flatMap((statement) => {
      if (!ts.isVariableStatement(statement)) return [];
      return statement.declarationList.declarations.filter((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === "SEEDS" && declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer));
    })[0]?.initializer;
    const required = ["name", "period", "summary", "principle", "feature", "phaseDescription"];
    if (seeds && ts.isArrayLiteralExpression(seeds)) {
      for (const seed of seeds.elements) {
        if (!ts.isArrayLiteralExpression(seed) || !ts.isStringLiteral(seed.elements[0])) continue;
        const id = seed.elements[0].text;
        const entry = englishMap?.properties.find((item) => propertyName(item) === id);
        if (!entry || !ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) {
          report(source, id, "English batch-three architect data", "missing English mapping");
          continue;
        }
        for (const field of required) {
          const property = entry.initializer.properties.find((item) => propertyName(item) === field);
          if (!property || !ts.isPropertyAssignment(property) || !ts.isStringLiteralLike(property.initializer)) {
            report(source, id, field, "missing English value");
          } else if (!property.initializer.text.trim() || cjk.test(property.initializer.text)) {
            report(source, id, field, "English value is empty or contains CJK text");
          }
        }
      }
    }
  }
  if (source.endsWith("history-architect-cards-batch-four.ts")) {
    const findVariableObject = (name) => {
      for (const statement of file.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name) && declaration.name.text === name && declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) return declaration.initializer;
        }
      }
      return null;
    };
    const englishMap = findVariableObject("BATCH_FOUR_ENGLISH");
    const seeds = file.statements.flatMap((statement) => {
      if (!ts.isVariableStatement(statement)) return [];
      return statement.declarationList.declarations.filter((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === "SEEDS" && declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer));
    })[0]?.initializer;
    const required = ["name", "period", "summary", "principle", "feature", "phaseDescription"];
    if (seeds && ts.isArrayLiteralExpression(seeds)) {
      for (const seed of seeds.elements) {
        if (!ts.isArrayLiteralExpression(seed) || !ts.isStringLiteral(seed.elements[0])) continue;
        const id = seed.elements[0].text;
        const entry = englishMap?.properties.find((item) => propertyName(item) === id);
        if (!entry || !ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) {
          report(source, id, "English batch-four architect data", "missing English mapping");
          continue;
        }
        for (const field of required) {
          const property = entry.initializer.properties.find((item) => propertyName(item) === field);
          if (!property || !ts.isPropertyAssignment(property) || !ts.isStringLiteralLike(property.initializer)) {
            report(source, id, field, "missing English value");
          } else if (!property.initializer.text.trim() || cjk.test(property.initializer.text)) {
            report(source, id, field, "English value is empty or contains CJK text");
          }
        }
      }
    }
  }
}

// The source files use optional English maps in several shared constructors. AST
// inspection alone can see the optional argument but cannot determine whether an
// individual card resolves to a value. Audit the actual aggregate consumed by
// /history so that every localized runtime leaf is verified.
const runtimeCheck = process.platform === "win32"
  ? spawnSync("npx.cmd", ["tsx", "scripts/check-history-learning-cards-runtime.mts"], { cwd: process.cwd(), encoding: "utf8", shell: true })
  : spawnSync("npx", ["tsx", "scripts/check-history-learning-cards-runtime.mts"], { cwd: process.cwd(), encoding: "utf8" });
if (runtimeCheck.status !== 0) {
  report("src/lib/history-learning-cards.ts", "runtime export", "HISTORY_LEARNING_CARDS", `runtime audit failed: ${runtimeCheck.stderr?.trim() || runtimeCheck.stdout?.trim() || runtimeCheck.error?.message || "unknown error"}`);
} else {
  try {
    const payload = runtimeCheck.stdout.trim().split(/\r?\n/).findLast((line) => line.trim().startsWith("["));
    if (!payload) throw new Error("no JSON payload");
    for (const issue of JSON.parse(payload)) {
      report("src/lib/history-learning-cards.ts", issue.id, issue.field, issue.message);
    }
  } catch (error) {
    report("src/lib/history-learning-cards.ts", "runtime export", "HISTORY_LEARNING_CARDS", `runtime audit produced invalid output: ${error instanceof Error ? error.message : "unknown error"}`);
  }
}

const historyClient = fs.readFileSync(pageSource, "utf8");
if (!historyClient.includes('useState<"ja" | "zh" | "en">')) report(pageSource, "language state", "English mode", "English is not an available language");
if (!historyClient.includes('lang === "en"')) report(pageSource, "language mappings", "English selector", "rendered values do not select English fields");
if (!historyClient.includes("nameEn") || !historyClient.includes("alt={")) report(pageSource, "linked building images", "English caption and alt text", "localized image caption wiring is absent");
if (!historyClient.includes("STYLE_COMPARISON_GROUPS")) report(pageSource, "comparison view", "comparison dataset", "comparison data is not wired into the page");

console.log(`Architectural history learning cards English issues: ${issues.length}`);
for (const issue of issues) console.log(`${issue.source}\t${issue.object}\t${issue.field}\t${issue.message}`);
if (issues.length) process.exitCode = 1;
