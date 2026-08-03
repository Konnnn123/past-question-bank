import fs from "fs";
import { generateEnvironmentCorrectStatement, type EnvironmentCorrectStatementFact } from "../src/lib/environment-correct-statement-generator";

type ApprovedProposition = EnvironmentCorrectStatementFact & { falseConstraints: string[] };
const pool = JSON.parse(fs.readFileSync("data/environment-correct-statement-approved-propositions.json", "utf8")) as { propositions: ApprovedProposition[] };
if (pool.propositions.length < 5) throw new Error(`requires five approved proposition packs; received ${pool.propositions.length}`);
if (new Set(pool.propositions.map((item) => item.id)).size !== pool.propositions.length) throw new Error("duplicate proposition id");
if (pool.propositions.some((item) => item.reviewStatus !== "approved" || !item.trueProposition || item.falseConstraints.length !== 3 || item.falsePropositions.length !== 3 || !item.reviewId)) throw new Error("incomplete approved proposition pack");
const coverage = new Set<string>();
for (let seed = 1; seed <= 1000; seed += 1) {
  const question = generateEnvironmentCorrectStatement(pool.propositions, seed);
  if (question.options.length !== 4 || new Set(question.options).size !== 4) throw new Error(`seed ${seed}: non-unique options`);
  if (!question.options.includes(question.correctAnswer) || question.correctIndex < 0) throw new Error(`seed ${seed}: correct answer invalid`);
  if (question.distractorAudit.length !== 3 || question.distractorAudit.some((item) => !item.isFalseForPrompt)) throw new Error(`seed ${seed}: false-proposition evidence missing`);
  coverage.add(question.sourceFactId);
}
const sameA = generateEnvironmentCorrectStatement(pool.propositions, 628);
const sameB = generateEnvironmentCorrectStatement(pool.propositions, 628);
if (JSON.stringify(sameA) !== JSON.stringify(sameB)) throw new Error("same seed is not reproducible");
console.log(JSON.stringify({ status: "pass", approvedPropositionPacks: pool.propositions.length, generatorSeeds: 1000, coverage: `${coverage.size}/${pool.propositions.length}`, sameSeedReproducible: true }, null, 2));
