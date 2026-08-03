import type { HistoryImageWordBankFact } from "@/lib/history-image-wordbank-eligibility";

// 2019 Specialist 1 History Q5: Fig. 1–25, Group A/B each with 30 terms.
const IMAGE_COUNT = 25;
const SURPLUS_COUNT = 5;
const BANK_SIZE = IMAGE_COUNT + SURPLUS_COUNT;
type AnswerAxis = "building" | "architect";

export type HistoryImageWordBankSet = {
  classification: "atomic_fact_generator";
  template: { id: "history_image_multi_wordbank_matching"; source: "2019 専門1 建築史 Q5"; imageCount: number; bankSize: number; surplusCount: number; reuseAllowed: false };
  seed: number;
  items: Array<{ id: string; factId: string; image: HistoryImageWordBankFact["image"]; answers: Record<AnswerAxis, string>; relations: Record<AnswerAxis, string> }>;
  wordBanks: Record<AnswerAxis, { terms: string[]; surplusTerms: string[]; semanticField: string }>;
  validation: ReturnType<typeof validateHistoryImageWordBankSet>;
};

function shuffled<T>(items: T[], seed: number) {
  const next = [...items];
  let state = seed >>> 0;
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const target = state % (index + 1);
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

function selectImages(facts: HistoryImageWordBankFact[], seed: number) {
  const selected: HistoryImageWordBankFact[] = [];
  const used = { building: new Set<string>(), architect: new Set<string>(), image: new Set<string>() };
  for (const fact of shuffled(facts, seed)) {
    if (used.image.has(fact.image.assetId) || used.building.has(fact.building.term) || used.architect.has(fact.architect.term)) continue;
    selected.push(fact);
    used.image.add(fact.image.assetId);
    used.building.add(fact.building.term);
    used.architect.add(fact.architect.term);
    if (selected.length === IMAGE_COUNT) return selected;
  }
  throw new Error(`History image word-bank requires ${IMAGE_COUNT} facts with unique building and architect answers`);
}

function selectSurplus(axis: AnswerAxis, facts: HistoryImageWordBankFact[], selected: HistoryImageWordBankFact[], seed: number) {
  const selectedImages = new Set(selected.map((fact) => fact.image.assetId));
  const selectedAnswers = new Set(selected.map((fact) => fact[axis].term));
  const terms: string[] = [];
  for (const fact of shuffled(facts, seed)) {
    const term = fact[axis].term;
    if (selectedImages.has(fact.image.assetId) || selectedAnswers.has(term) || terms.includes(term)) continue;
    terms.push(term);
    if (terms.length === SURPLUS_COUNT) return terms;
  }
  throw new Error(`Insufficient constrained ${axis} surplus terms`);
}

export function validateHistoryImageWordBankSet(set: Omit<HistoryImageWordBankSet, "validation">) {
  const axes: AnswerAxis[] = ["building", "architect"];
  const uniqueImages = new Set(set.items.map((item) => item.image.assetId)).size === IMAGE_COUNT;
  const assetsExist = set.items.every((item) => item.image.exists && item.image.webPath.startsWith("/images/"));
  const bankChecks = axes.map((axis) => {
    const answers = set.items.map((item) => item.answers[axis]);
    const bank = set.wordBanks[axis];
    const answerTermsUnique = new Set(answers).size === IMAGE_COUNT;
    const answersInBank = answers.every((term) => bank.terms.includes(term));
    const surplusIsIndependent = bank.surplusTerms.every((term) => !answers.includes(term));
    const bankUnique = new Set(bank.terms).size === BANK_SIZE;
    return { axis, answerTermsUnique, answersInBank, surplusIsIndependent, bankUnique, bankSizeCorrect: bank.terms.length === BANK_SIZE };
  });
  const passed = uniqueImages && assetsExist && bankChecks.every((check) => Object.values(check).filter((value) => typeof value === "boolean").every(Boolean));
  return { passed, uniqueImages, assetsExist, bankChecks };
}

export function generateHistoryImageWordBank(facts: HistoryImageWordBankFact[], seed: number): HistoryImageWordBankSet {
  const eligible = facts.filter((fact) => fact.subject === "history" && fact.reviewStatus === "approved" && fact.templateId === "history_image_multi_wordbank_matching" && fact.domain === "history_image" && fact.image.exists);
  const selected = selectImages(eligible, seed);
  const wordBanks = {
    building: { semanticField: "building_name", surplusTerms: selectSurplus("building", eligible, selected, seed + 101), terms: [] as string[] },
    architect: { semanticField: "architect", surplusTerms: selectSurplus("architect", eligible, selected, seed + 211), terms: [] as string[] },
  };
  for (const axis of ["building", "architect"] as const) {
    wordBanks[axis].terms = shuffled([...selected.map((fact) => fact[axis].term), ...wordBanks[axis].surplusTerms], seed + axis.length * 1009);
  }
  const base = {
    classification: "atomic_fact_generator" as const,
    template: { id: "history_image_multi_wordbank_matching" as const, source: "2019 専門1 建築史 Q5" as const, imageCount: IMAGE_COUNT, bankSize: BANK_SIZE, surplusCount: SURPLUS_COUNT, reuseAllowed: false as const },
    seed,
    items: selected.map((fact, index) => ({
      id: `history-image-wb-${index + 1}`,
      factId: fact.id,
      image: fact.image,
      answers: { building: fact.building.term, architect: fact.architect.term },
      relations: { building: "image_to_building", architect: "image_to_architect" },
    })),
    wordBanks,
  };
  const validation = validateHistoryImageWordBankSet(base);
  if (!validation.passed) throw new Error(`History image word-bank validation failed for seed ${seed}`);
  return { ...base, validation };
}
