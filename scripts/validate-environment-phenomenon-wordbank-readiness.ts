import fs from "fs";
import { generateEnvironmentPhenomenonWordBank, getEligibleEnvironmentPhenomenonFacts, PHENOMENON_TEMPLATE, type EnvironmentPhenomenonFact } from "../src/lib/environment-phenomenon-wordbank-generator";

const candidates = (JSON.parse(fs.readFileSync("data/environment-phenomenon-defined-as-candidates.json", "utf8")) as { candidates: EnvironmentPhenomenonFact[] }).candidates;
const approvedFacts = (JSON.parse(fs.readFileSync("data/environment-phenomenon-approved-facts.json", "utf8")) as { facts: EnvironmentPhenomenonFact[] }).facts;
const eligible = getEligibleEnvironmentPhenomenonFacts(approvedFacts);
const PRODUCTION_RECOMMENDED_POOL = 40;
const countByDomain = (facts: EnvironmentPhenomenonFact[]) => Object.fromEntries(
  [...new Set(candidates.map((candidate) => candidate.domain))].sort().map((domain) => [domain, facts.filter((fact) => fact.domain === domain).length]),
);
const approvedByDomain = countByDomain(eligible);
const candidateByDomain = countByDomain(candidates);
const normalizedTerms = candidates.map((candidate) => candidate.canonicalTerm.normalize("NFKC").replace(/[\s・（）()]/g, "").toLowerCase());
const synonymConflicts = normalizedTerms.filter((term, index) => normalizedTerms.indexOf(term) !== index).length;
const hasTechnicalMinimum = eligible.length >= PHENOMENON_TEMPLATE.bankSize;
const hasProductionPool = eligible.length >= PRODUCTION_RECOMMENDED_POOL;
let generatorMessage = "";
let hundredSeedMetrics: Record<string, unknown> | null = null;
if (hasTechnicalMinimum) {
  const exams = Array.from({ length: 100 }, (_, seed) => generateEnvironmentPhenomenonWordBank(approvedFacts, seed + 1));
  const answerCounts = new Map<string, number>();
  const surplusCounts = new Map<string, number>();
  let noSolution = 0;
  let multipleSolution = 0;
  let overlapTotal = 0;
  let overlapPairs = 0;
  for (let index = 0; index < exams.length; index += 1) {
    const exam = exams[index];
    const answers = new Set(exam.items.map((item) => item.answer));
    const bank = new Set(exam.wordBank);
    if (answers.size !== PHENOMENON_TEMPLATE.answerCount || [...answers].some((term) => !bank.has(term))) multipleSolution += 1;
    if (bank.size !== PHENOMENON_TEMPLATE.bankSize) noSolution += 1;
    exam.items.forEach((item) => answerCounts.set(item.answer, (answerCounts.get(item.answer) ?? 0) + 1));
    exam.surplusTerms.forEach((term) => surplusCounts.set(term, (surplusCounts.get(term) ?? 0) + 1));
    for (let prior = 0; prior < index; prior += 1) {
      const priorTerms = new Set(exams[prior].wordBank);
      overlapTotal += exam.wordBank.filter((term) => priorTerms.has(term)).length;
      overlapPairs += 1;
    }
  }
  hundredSeedMetrics = {
    answerCoverage: `${answerCounts.size}/${eligible.length}`,
    surplusCoverage: `${surplusCounts.size}/${eligible.length}`,
    averageExamTermOverlap: overlapPairs ? Number((overlapTotal / overlapPairs).toFixed(2)) : 0,
    fixedHighFrequencyTerms: [...new Set([...answerCounts.keys(), ...surplusCounts.keys()])].filter((term) => (answerCounts.get(term) ?? 0) + (surplusCounts.get(term) ?? 0) === 100),
    multipleSolution,
    noSolution,
    synonymConflicts,
  };
} else {
  try { generateEnvironmentPhenomenonWordBank(approvedFacts, 1); } catch (error) { generatorMessage = error instanceof Error ? error.message : String(error); }
  if (!generatorMessage) throw new Error("readiness validator must fail below the approved technical minimum");
}
console.log(JSON.stringify({
  decision: hasTechnicalMinimum ? (hasProductionPool ? "production_pool_ready_for_generator_validation" : "technical_minimum_only") : "manual_review_required",
  approvedCompatibleFacts: eligible.length,
  candidateFacts: candidates.length,
  minimumBankSize: PHENOMENON_TEMPLATE.bankSize,
  productionRecommendedPool: PRODUCTION_RECOMMENDED_POOL,
  technicalMinimumReadiness: hasTechnicalMinimum,
  productionPoolReadiness: hasProductionPool,
  answersPerExam: PHENOMENON_TEMPLATE.answerCount,
  surplusPerExam: PHENOMENON_TEMPLATE.surplusCount,
  approvedByDomain,
  candidateByDomain,
  hundredSeedMetrics,
  candidateTermsNeedingLegalDistractorReview: candidates.filter((candidate) => candidate.templateCompatibility !== "compatible").map((candidate) => candidate.canonicalTerm),
  synonymConflicts,
  generatorMessage: generatorMessage || null,
}, null, 2));
