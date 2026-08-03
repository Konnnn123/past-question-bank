import fs from "fs";
import { assembleBuildingConstructionMock, type MockData } from "../src/lib/building-construction-mock";
import blueprint from "../data/building-construction-full-exam-blueprint.json";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

const shared = readJson<MockData["shared"]>("data/building-construction-shared-wordbank-generated-v1.json");
const formats = readJson<{ families: MockData["formats"] }>("data/building-construction-production-formats-v1.json").families;
const numeric = readJson<{ questions: MockData["numeric"] }>("data/building-construction-numerical-pilot.json").questions;
const rcFacts = readJson<{ facts: NonNullable<MockData["rcFacts"]> }>("data/building-construction-rc-shared-wordbank-facts.json").facts;
const data: MockData = { shared, formats, numeric, rcFacts };
const generatedSemanticSets = new Set<string>();

for (let seed = 1; seed <= 100; seed += 1) {
  const blocks = assembleBuildingConstructionMock(data, seed);
  assert(blocks.length === 1 && blocks[0].id === "rc-shared-word-bank", `seed ${seed}: RC generator must be the primary full-mock block`);
  assert(blocks[0].items.length === blueprint.total_scoring_units && blocks[0].sourceType === "atomic_fact_generator", `seed ${seed}: RC generator block mismatch`);
  assert(new Set(blocks[0].items.map((item) => item.answer)).size === blueprint.total_scoring_units, `seed ${seed}: duplicate generated answers`);
  generatedSemanticSets.add(blocks[0].items.map((item) => item.factId).sort().join("|"));
  assert(!/buckling|structural_mechanics|effective_buckling|second_moment|pcr|\bei\b/i.test(JSON.stringify(blocks)), `seed ${seed}: Structural Mechanics leaked into mock`);
}

const sameSeedA = assembleBuildingConstructionMock(data, 731);
const sameSeedB = assembleBuildingConstructionMock(data, 731);
assert(JSON.stringify(sameSeedA) === JSON.stringify(sameSeedB), "same seed does not reproduce the complete mock");
assert(generatedSemanticSets.size > 1, "Different seeds did not produce different generated RC fact sets.");

console.log(JSON.stringify({
  decision: "pass",
  completeMockSeeds: 100,
  runtimeMode: "20 atomic_fact_generator; indexed 2024 Q3 reconstruction retained as fallback",
  itemsPerMock: 20,
  generatorRatio: "20/20 (100%)",
  generatedSemanticSets: generatedSemanticSets.size,
  structuralMechanicsLeakage: 0,
  sameSeedReproducible: true,
}, null, 2));
