import fs from "fs";
import { generateEnvironmentPhenomenonWordBank, type EnvironmentPhenomenonFact } from "../src/lib/environment-phenomenon-wordbank-generator";

const facts = (JSON.parse(fs.readFileSync("data/environment-phenomenon-approved-facts.json", "utf8")) as { facts: EnvironmentPhenomenonFact[] }).facts;
const coverage = new Set<string>();
for (let seed = 1; seed <= 1000; seed += 1) {
  const exam = generateEnvironmentPhenomenonWordBank(facts, seed);
  if (exam.items.length !== 7 || exam.wordBank.length !== 16 || exam.surplusTerms.length !== 9) throw new Error(`seed ${seed}: template count mismatch`);
  if (new Set(exam.wordBank).size !== 16 || new Set(exam.items.map((item) => item.answer)).size !== 7) throw new Error(`seed ${seed}: duplicate term`);
  if (exam.items.some((item) => !exam.wordBank.includes(item.answer)) || exam.surplusTerms.some((term) => exam.items.some((item) => item.answer === term))) throw new Error(`seed ${seed}: answer/surplus collision`);
  exam.wordBank.forEach((term) => coverage.add(term));
}
const a = generateEnvironmentPhenomenonWordBank(facts, 918);
const b = generateEnvironmentPhenomenonWordBank(facts, 918);
if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error("same seed is not reproducible");
console.log(JSON.stringify({ status: "pass", seeds: 1000, coverage: `${coverage.size}/${facts.length}`, sameSeedReproducible: true }, null, 2));
