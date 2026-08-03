import type { MaterialDensityFact } from "@/lib/building-construction-material-density-generator";
import type { MaterialElasticityFact } from "@/lib/building-construction-material-elasticity-generator";
import type { MaterialStrengthFact } from "@/lib/building-construction-material-strength-generator";
import { generateRCSharedWordBank, type SharedWordBankFact } from "@/lib/building-construction-shared-wordbank-generator";

export type MockItem = { id: string; factId?: string; prompt?: string; answer?: string; choices?: string[]; accepted?: string[]; terms?: string[]; rubric?: string[]; domain?: string };
export type Family = { items: MockItem[]; wordBank?: string[]; reviewMode?: string; asset?: { path: string; description: string } };
export type NumericItem = { id: string; prompt: string; correctAnswer: string; options: string[]; correctIndex: number };
export type MockData = { shared: Family; formats: Record<string, Family>; numeric: NumericItem[]; rcFacts?: SharedWordBankFact[]; materialDensityFacts?: MaterialDensityFact[]; materialStrengthFacts?: MaterialStrengthFact[]; materialElasticityFacts?: MaterialElasticityFact[] };
export type MockBlock = { id: string; title: string; mode: "choice" | "input" | "shared" | "written"; items: MockItem[]; wordBank?: string[]; asset?: Family["asset"]; sourceType?: "past_exam_reconstruction" | "question_bank_sampler" | "atomic_fact_generator" | "verified_parameterized_generator" };

const normalize = (value: string) => value.toLowerCase().replace(/[\s、，（）()]/g, "");

function seededShuffle<T>(items: T[], seed: number): T[] {
  const next = [...items];
  let state = seed >>> 0;
  for (let index = next.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const target = state % (index + 1);
    [next[index], next[target]] = [next[target], next[index]];
  }
  return next;
}

export function assembleBuildingConstructionMock(data: MockData, seed = Date.now()): MockBlock[] {
  const inline = seededShuffle(data.formats.inline_four_choice_fill.items, seed);
  if (inline.length !== 20) throw new Error(`2024 Q3 blueprint requires 20 inline slots; received ${inline.length}`);
  const answers = inline.map((item) => normalize(item.answer ?? item.id));
  if (new Set(answers).size !== answers.length) throw new Error("2024 Q3 blueprint has duplicate answer slots.");
  const eligibleRcFacts = data.rcFacts ?? [];
  if (eligibleRcFacts.length >= 27) {
    const generated = generateRCSharedWordBank(eligibleRcFacts, seed + 1009);
    const generatedItems: MockItem[] = generated.items.map((item) => ({
      id: item.id,
      factId: item.factId,
      prompt: item.prompt,
      answer: item.answer,
      domain: generated.domain,
    }));
    return [{ id: "rc-shared-word-bank", title: "RC構造・共通語群（生成）", mode: "shared", items: generatedItems, wordBank: generated.wordBank, sourceType: "atomic_fact_generator" }];
  }
  // Preserve the fully indexed 2024 Q3 reconstruction only as an explicit
  // operational fallback when the verified RC pool is unavailable.
  return [{ id: "inline", title: "2024 専門1 建築構法 Q3・四択穴埋め（fallback）", mode: "choice", items: inline, sourceType: "past_exam_reconstruction" }];
}
