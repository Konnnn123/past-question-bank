import fs from "fs";

const files = [
  "data/history-full-exam-blueprint.json",
  "data/planning-full-exam-blueprint.json",
  "data/building-construction-full-exam-blueprint.json",
  "data/environment-full-exam-blueprint.json",
];

for (const file of files) {
  const blueprint = JSON.parse(fs.readFileSync(file, "utf8")) as { id?: string; basis_years?: number[]; total_scoring_units?: number; sections?: Array<{ target_count?: number; scoring_units_per_item?: number; evidence_files?: string[] }>; evidence_files?: string[] };
  if (!blueprint.id || !blueprint.basis_years?.length || !blueprint.evidence_files?.length || !blueprint.sections?.length) throw new Error(`${file}: missing required blueprint evidence`);
  const count = blueprint.sections.reduce((sum, section) => sum + (section.target_count ?? 0) * (section.scoring_units_per_item ?? 1), 0);
  if (count !== blueprint.total_scoring_units) throw new Error(`${file}: scoring-unit total ${count} does not match ${blueprint.total_scoring_units}`);
  if (blueprint.evidence_files.some((evidence) => !fs.existsSync(evidence))) throw new Error(`${file}: missing evidence file`);
}
console.log(JSON.stringify({ decision: "pass", blueprints: files.length }, null, 2));
