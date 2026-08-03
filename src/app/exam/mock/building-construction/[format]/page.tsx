import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import BuildingConstructionFormatClient from "./BuildingConstructionFormatClient";
import SharedWordBankGeneratorClient from "./SharedWordBankGeneratorClient";

const formatToFamily: Record<string, string> = {
  "shared-word-bank": "shared_word_bank_fill",
  "short-answer": "scoped_term_short_answer",
  "inline-four-choice": "inline_four_choice_fill",
  "diagram-label": "diagram_label_word_bank",
  "image-form-matching": "image_form_matching",
  "constrained-explanation": "diagram_constrained_explanation",
  "comparison-explanation": "diagram_comparison_explanation"
};

export function generateStaticParams() {
  return Object.keys(formatToFamily).map((format) => ({ format }));
}

export default async function Page({ params }: { params: Promise<{ format: string }> }) {
  const { format } = await params;
  const familyId = formatToFamily[format];
  if (!familyId) notFound();
  if (familyId === "shared_word_bank_fill") {
    const factsPath = path.join(process.cwd(), "data", "building-construction-rc-shared-wordbank-facts.json");
    const factSource = JSON.parse(fs.readFileSync(factsPath, "utf-8")) as { facts: unknown[] };
    return <SharedWordBankGeneratorClient facts={factSource.facts as Parameters<typeof SharedWordBankGeneratorClient>[0]["facts"]} />;
  }
  const isSharedBank = familyId === "shared_word_bank_fill";
  const dataPath = path.join(process.cwd(), isSharedBank ? "data/building-construction-shared-wordbank-generated-v1.json" : "data/building-construction-production-formats-v1.json");
  const source = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as { families?: Record<string, unknown>; wordBank?: string[]; wordbank?: string[]; prototype?: unknown; items?: unknown[]; status?: string };
  const family = isSharedBank ? { ...source, wordBank: source.wordBank ?? source.wordbank } : source.families?.[familyId];
  if (!family) notFound();
  return <BuildingConstructionFormatClient format={format} family={family as Parameters<typeof BuildingConstructionFormatClient>[0]["family"]} />;
}
