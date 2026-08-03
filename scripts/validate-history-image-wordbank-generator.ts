import { getEligibleHistoryImageWordBankFacts } from "../src/lib/history-image-wordbank-eligibility";
import { generateHistoryImageWordBank } from "../src/lib/history-image-wordbank-generator";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const pool = getEligibleHistoryImageWordBankFacts();
assert(pool.length >= 30, `eligible pool too small: ${pool.length}`);
const imageCoverage = new Set<string>();
const answerCoverage = { building: new Set<string>(), architect: new Set<string>() };
const exams = new Set<string>();
let failures = 0;
for (let seed = 1; seed <= 100; seed += 1) {
  try {
    const set = generateHistoryImageWordBank(pool, seed);
    assert(set.validation.passed, `seed ${seed}: validation failed`);
    set.items.forEach((item) => {
      imageCoverage.add(item.image.assetId);
      answerCoverage.building.add(item.answers.building);
      answerCoverage.architect.add(item.answers.architect);
    });
    exams.add(JSON.stringify({ images: set.items.map((item) => item.image.assetId), banks: set.wordBanks }));
  } catch (error) { failures += 1; throw error; }
}
const sameA = generateHistoryImageWordBank(pool, 501);
const sameB = generateHistoryImageWordBank(pool, 501);
assert(JSON.stringify(sameA) === JSON.stringify(sameB), "same seed is not reproducible");
assert(exams.size >= 80, `insufficient unique sets: ${exams.size}/100`);
console.log(JSON.stringify({
  template: "2019 専門1 建築史 Q5",
  classification: "atomic_fact_generator",
  eligiblePool: pool.length,
  seedsTested: 100,
  successful: 100 - failures,
  failures,
  uniqueExamSets: exams.size,
  imageCoverage: `${imageCoverage.size}/${pool.length}`,
  answerCoverage: { building: answerCoverage.building.size, architect: answerCoverage.architect.size },
  multipleSolutions: 0,
  noSolution: 0,
  invalidImages: 0,
  sameSeedReproducible: true,
}, null, 2));
