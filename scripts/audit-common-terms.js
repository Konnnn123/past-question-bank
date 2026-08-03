const fs = require("fs");
const path = require("path");
const auditPath = "audit-common-terms.md";
const marker = "\n## Batch 2 — Remaining candidates\n";
const facts = JSON.parse(fs.readFileSync("data/atomic-facts.json", "utf8")).facts.filter((fact) => fact.subject === "construction");
const sourceDir = "data/processed_questions";
const sourceFiles = fs.readdirSync(sourceDir).filter((name) => name.endsWith(".md") && name.includes("建筑构法"));
const corpus = [...sourceFiles.map((name) => ({ path: path.join(sourceDir, name), text: fs.readFileSync(path.join(sourceDir, name), "utf8") })), { path: "data/construction-exam-answers.json", text: fs.readFileSync("data/construction-exam-answers.json", "utf8") }];
const byTerm = new Map();
for (const fact of facts) { const rows = byTerm.get(fact.entityName) ?? []; rows.push(fact); byTerm.set(fact.entityName, rows); }
const candidates = [...byTerm.entries()].filter(([, rows]) => rows.some((fact) => fact.relation === "belongs_to") && rows.some((fact) => fact.relation === "appears_in_exam")).map(([term, rows]) => ({ term, rows })).sort((a, b) => a.term.localeCompare(b.term, "ja"));
const pool = JSON.parse(fs.readFileSync("data/building-construction-rc-shared-wordbank-facts.json", "utf8")).facts.map((fact) => fact.term);
const lines = [marker.trim(), "", "This batch audits every remaining wide-screen candidate (#11 onward). `source hit` means an exact repository search hit in a Specialist 1 construction source or answer index; it is evidence of occurrence, not automatic promotion.", "", "| # | Candidate | Atomic evidence | Repository-source hit | Seed-pool relation | Decision |", "| ---: | --- | --- | --- | --- | --- |"];
let promoted = 0, held = 0, duplicate = 0;
for (let index = 10; index < candidates.length; index += 1) {
  const { term, rows } = candidates[index];
  const years = [...new Set(rows.filter((fact) => fact.relation === "appears_in_exam").map((fact) => fact.value))].join(", ");
  const hits = corpus.filter((file) => file.text.includes(term)).map((file) => file.path).filter((file) => file.includes("専門1") || file.endsWith("construction-exam-answers.json"));
  const exactPool = pool.includes(term) || pool.some((item) => item.includes(term) || term.includes(item));
  let decision;
  if (exactPool) { decision = "duplicate / do not promote"; duplicate += 1; }
  else { decision = hits.length ? "hold — occurrence evidence only; definition/relation/distractor review required" : "hold — no accessible exact source definition"; held += 1; }
  lines.push(`| ${index + 1} | ${term.replaceAll("|", "\\|")} | appears_in_exam: ${years || "none"}; all source facts unreviewed | ${hits.length ? hits.join("<br>") : "none"} | ${exactPool ? "overlaps 27-term seed pool" : "not eligible without independent definition"} | ${decision} |`);
}
lines.push("", "## Full-queue reconciliation", "", `- Wide-screen candidate total: **${candidates.length}**`, "- Batch 1 audited: **10**", `- Batch 2 audited: **${candidates.length - 10}**`, `- Total audited: **${candidates.length}**`, `- New promotions in batch 2: **${promoted}**`, `- Holds in batch 2: **${held}**`, `- Seed-pool duplicates in batch 2: **${duplicate}**`, "- RC semantic-association pack merged: **0**", "", "All remaining candidates are held because the central Atomic Fact entries remain `unreviewed` and do not themselves provide the required standalone definition plus relation and constrained-distractor compatibility. No candidate was added to the 27-fact seed pool.");
const prior = fs.readFileSync(auditPath, "utf8");
fs.writeFileSync(auditPath, prior.split(marker)[0] + "\n" + lines.join("\n") + "\n", "utf8");
