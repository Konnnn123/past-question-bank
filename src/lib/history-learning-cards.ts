import type { HistoryLearningCard } from "@/types/history-learning-card";
import { HISTORY_LEARNING_CARD_EXAMPLES } from "@/lib/history-learning-card-examples";
import { JAPANESE_STYLE_CARDS } from "@/lib/history-style-cards";
import { WESTERN_STYLE_CARDS } from "@/lib/western-style-cards";
import { SHRINE_STYLE_CARDS } from "@/lib/shrine-style-cards";
import { SUPPLEMENTARY_STYLE_CARDS } from "@/lib/supplementary-style-cards";
import { HISTORY_MOVEMENT_CARDS } from "@/lib/history-movement-cards";
import { HISTORY_ARCHITECT_CARDS } from "@/lib/history-architect-cards";
import { WESTERN_ARCHITECT_CARDS_2 } from "@/lib/history-architect-cards-western";
import { JAPANESE_ARCHITECT_CARDS_2 } from "@/lib/history-architect-cards-japan";
import { CORE_ARCHITECT_CARDS } from "@/lib/history-architect-cards-core";
import { BATCH_TWO_ARCHITECT_CARDS } from "@/lib/history-architect-cards-batch-two";
import { BATCH_THREE_ARCHITECT_CARDS } from "@/lib/history-architect-cards-batch-three";
import { BATCH_FOUR_ARCHITECT_CARDS } from "@/lib/history-architect-cards-batch-four";
import { FINAL_AUDIT_ARCHITECT_CARDS } from "@/lib/history-architect-cards-final-audit";
import { ADDITIONAL_HISTORY_STYLE_CARDS } from "@/lib/additional-history-style-cards";
import { BUILDING_TYPE_LEARNING_CARDS } from "@/lib/building-type-learning-cards";
import { JAPANESE_SPECIAL_STYLE_CARDS } from "@/lib/japanese-special-style-cards";
import { HISTORY_GAP_CARDS } from "@/lib/history-gap-cards";
import { HISTORY_FORMATION_BACKGROUND_OVERRIDES } from "@/lib/history-formation-backgrounds";
import { EXTRA_HISTORY_FORMATION_BACKGROUNDS } from "@/lib/history-formation-backgrounds-extra";

const FORMATION_BACKGROUND_OVERRIDES = {
  ...HISTORY_FORMATION_BACKGROUND_OVERRIDES,
  ...EXTRA_HISTORY_FORMATION_BACKGROUNDS,
};

const all = [
  ...HISTORY_LEARNING_CARD_EXAMPLES,
  ...JAPANESE_STYLE_CARDS,
  ...WESTERN_STYLE_CARDS,
  ...SHRINE_STYLE_CARDS,
  ...SUPPLEMENTARY_STYLE_CARDS,
  ...ADDITIONAL_HISTORY_STYLE_CARDS,
  ...BUILDING_TYPE_LEARNING_CARDS,
  ...JAPANESE_SPECIAL_STYLE_CARDS,
  ...HISTORY_GAP_CARDS,
  ...HISTORY_MOVEMENT_CARDS,
  ...HISTORY_ARCHITECT_CARDS,
  ...WESTERN_ARCHITECT_CARDS_2,
  ...JAPANESE_ARCHITECT_CARDS_2,
  ...CORE_ARCHITECT_CARDS,
  ...BATCH_TWO_ARCHITECT_CARDS,
  ...BATCH_THREE_ARCHITECT_CARDS,
  ...BATCH_FOUR_ARCHITECT_CARDS,
  ...FINAL_AUDIT_ARCHITECT_CARDS,
].map((card): HistoryLearningCard => {
  if (card.kind === "style") {
    const background = FORMATION_BACKGROUND_OVERRIDES[card.id];
    return {
      ...card,
      ...(background
        ? { formationBackground: { ...card.formationBackground, ...background } }
        : {}),
      reviewStatus: "reviewed",
    };
  }
  return { ...card, reviewStatus: "reviewed" };
});

const byId = new Map<string, HistoryLearningCard>();
for (const card of all) {
  if (byId.has(card.id)) throw new Error(`Duplicate history learning card id: ${card.id}`);
  byId.set(card.id, card);
}

export const HISTORY_LEARNING_CARDS = all;
export const HISTORY_LEARNING_CARDS_BY_ID = byId;
export const STYLE_LEARNING_CARDS = all.filter((card) => card.kind === "style");
export const MOVEMENT_LEARNING_CARDS = all.filter((card) => card.kind === "movement");
export const ARCHITECT_LEARNING_CARDS = all.filter((card) => card.kind === "architect");
export const BUILDING_TYPE_LEARNING_CARDS_ALL = all.filter((card) => card.kind === "building-type");

export function getHistoryLearningCard(id: string) {
  return byId.get(id);
}
