import type { ArchitectureBuilding, ArchitectureRegion, ImportanceProfile } from "@/types/architecture";

export interface AnkiImportRecord {
  source: { kind: "anki"; noteId: string; deck: string };
  name: string;
  fields: {
    image: string;
    buildingName: string;
    period: string;
    style: string;
    people: string;
    history: string;
  };
  tags: string[];
  mediaRefs: string[];
  reviewStatus: "imported";
  qualityFlags: string[];
}

export function sourceImportance(tags: string[]): 1 | 2 | 3 | undefined {
  const tag = tags.find((value) => value.startsWith("重要度:"));
  if (!tag) return undefined;
  if (tag.includes("⭐⭐⭐")) return 3;
  if (tag.includes("⭐⭐")) return 2;
  if (tag.includes("⭐")) return 1;
  return undefined;
}

export function regionFromDeck(deck: string): ArchitectureRegion {
  if (deck.includes("日本")) return "japan";
  if (deck.includes("西洋")) return "western";
  return "global";
}

export function makeImportedBuilding(record: AnkiImportRecord, index: number): ArchitectureBuilding {
  const id = `building-anki-${record.source.noteId}`;
  const sourceImportanceValue = sourceImportance(record.tags);
  const importance: ImportanceProfile = {
    academicImportance: 2,
    sourceImportance: sourceImportanceValue,
    examFrequency: 0,
    examImportance: 1,
  };
  return {
    id,
    name: { ja: record.fields.buildingName || record.name, zh: record.fields.buildingName || record.name },
    aliases: [],
    period: { ja: record.fields.period, zh: record.fields.period },
    location: { ja: "", zh: "" },
    regions: [regionFromDeck(record.source.deck)],
    typeIds: [],
    styleIds: [],
    movementIds: [],
    theoryIds: [],
    architectIds: [],
    relatedPersonIds: [],
    structure: { ja: "", zh: "" },
    space: { ja: "", zh: "" },
    history: { ja: record.fields.history, zh: record.fields.history },
    imageIds: record.mediaRefs.map((_, mediaIndex) => `${id}-image-${mediaIndex}`),
    importance,
    examEvidence: [],
    sources: [{ kind: "anki", locator: record.source.noteId, note: record.source.deck }],
    reviewStatus: record.qualityFlags.length ? "needs-review" : "imported",
    qualityFlags: [...record.qualityFlags, `import-index:${index}`],
  };
}
