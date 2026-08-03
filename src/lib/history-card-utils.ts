import type { HistoryLearningCard } from "@/types/history-learning-card";
import { HISTORY_LEARNING_CARDS } from "@/lib/history-learning-cards";

export interface LinkedBuilding {
  id: string;
  ja: string;
  en: string;
}

/** A card enriched with its linked building summaries */
export interface EnrichedCard {
  card: HistoryLearningCard;
  buildingCount: number;
  buildings: LinkedBuilding[];
}

/** Map from card ID to enriched card */
export function getEnrichedCards(
  buildingLinks: { buildingId: string; buildingNameJa: string; buildingNameEn: string; learningCardIds: string[] }[]
): Map<string, EnrichedCard> {
  const cardToBuildings = new Map<string, LinkedBuilding[]>();
  for (const b of buildingLinks) {
    for (const cid of b.learningCardIds) {
      if (!cardToBuildings.has(cid)) cardToBuildings.set(cid, []);
      const existing = cardToBuildings.get(cid)!;
      if (!existing.find((x) => x.id === b.buildingId)) {
        existing.push({ id: b.buildingId, ja: b.buildingNameJa, en: b.buildingNameEn });
      }
    }
  }

  const map = new Map<string, EnrichedCard>();
  for (const card of HISTORY_LEARNING_CARDS) {
    const buildings = cardToBuildings.get(card.id) ?? [];
    map.set(card.id, { card, buildingCount: buildings.length, buildings });
  }
  return map;
}

/** Group cards by kind */
export function getCardsByKind(): {
  styles: HistoryLearningCard[];
  movements: HistoryLearningCard[];
  architects: HistoryLearningCard[];
  buildingTypes: HistoryLearningCard[];
} {
  return {
    styles: HISTORY_LEARNING_CARDS.filter((c) => c.kind === "style"),
    movements: HISTORY_LEARNING_CARDS.filter((c) => c.kind === "movement"),
    architects: HISTORY_LEARNING_CARDS.filter((c) => c.kind === "architect"),
    buildingTypes: HISTORY_LEARNING_CARDS.filter((c) => c.kind === "building-type"),
  };
}

/** Filter cards by region */
export function filterByRegion(cards: HistoryLearningCard[], regions: string[]): HistoryLearningCard[] {
  if (regions.length === 0) return cards;
  return cards.filter((c) => c.regions.some((r) => regions.includes(r)));
}

/** Get a card by ID */
export function getCardById(id: string): HistoryLearningCard | undefined {
  return HISTORY_LEARNING_CARDS.find((c) => c.id === id);
}
