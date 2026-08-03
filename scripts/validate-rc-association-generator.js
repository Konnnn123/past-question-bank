const fs = require("fs");

const facts = JSON.parse(fs.readFileSync("data/building-construction-rc-reviewed-facts.json", "utf8"));
const projection = JSON.parse(fs.readFileSync("data/building-construction-rc-association-projections.json", "utf8"));
const generated = JSON.parse(fs.readFileSync("data/building-construction-rc-association-generated-v1.json", "utf8"));
const releaseAudit = JSON.parse(fs.readFileSync("data/building-construction-rc-association-release-audit.json", "utf8"));
const factById = new Map(facts.facts.map((fact) => [fact.id, fact]));

if (projection.items.length !== 10 || generated.items.length !== 10 || generated.wordBank.length !== 10) throw new Error("2017 prototype size mismatch");
if (new Set(generated.items.map((item) => item.answer)).size !== 10) throw new Error("reuse forbidden: answers must be unique");
for (const item of generated.items) {
  const fact = factById.get(item.factId);
  if (!fact || fact.reviewStatus !== "reviewed") throw new Error(`unreviewed fact: ${item.factId}`);
  if (!generated.wordBank.includes(item.answer)) throw new Error(`answer absent from bank: ${item.id}`);
  const projectionItem = projection.items.find((source) => source.factId === item.factId && source.answer === item.answer && source.prompt === item.prompt);
  if (!projectionItem) throw new Error(`projection mismatch: ${item.id}`);
  if (!projectionItem.novelContext) throw new Error(`missing novel context: ${item.id}`);
}
if (generated.primaryDomain !== "rc_construction" || /structural_mechanics|buckling|second_moment/.test(JSON.stringify(generated))) throw new Error("scope failure");
if (generated.status !== "production_ready" || releaseAudit.decision !== "production_ready" || releaseAudit.checkedItemCount !== generated.items.length) throw new Error("release audit failure");
if (Object.values(releaseAudit.results).some((result) => result.status !== "pass")) throw new Error("release audit contains a failed gate");
console.log(JSON.stringify({ id: generated.id, promptCount: generated.items.length, bankSize: generated.wordBank.length, reviewedFacts: generated.items.map((item) => item.factId), prototypeRegressionPassed: true, releaseAudit: releaseAudit.decision }, null, 2));
