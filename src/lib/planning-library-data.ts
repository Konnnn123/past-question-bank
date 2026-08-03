import "server-only";
import fs from "fs";
import path from "path";
import type { PlanningCopy, PlanningLibraryItem } from "./planning-library-types";

interface RawRecord { source: { noteId: string; deck: string }; fields: { image: string; style: string }; tags: string[] }
interface ImageMap { notes: Record<string, string[]> }

const LABELS: Record<string, PlanningCopy> = {
  UD: { zh: "通用设计", ja: "ユニバーサルデザイン", en: "Universal design" }, オフィスビル: { zh: "办公建筑", ja: "オフィスビル", en: "Office buildings" }, コミュ二ティ施設: { zh: "社区设施", ja: "コミュニティ施設", en: "Community facilities" },
  "博物馆·美术馆": { zh: "博物馆·美术馆", ja: "博物館・美術館", en: "Museums and galleries" }, 都市计划: { zh: "城市规划", ja: "都市計画", en: "Urban planning" }, 防灾: { zh: "防灾", ja: "防災", en: "Disaster prevention" },
  福祉设施: { zh: "福利设施", ja: "福祉施設", en: "Welfare facilities" }, 剧场: { zh: "剧场", ja: "劇場", en: "Theatres" }, 空间计划: { zh: "空间规划", ja: "空間計画", en: "Spatial planning" },
  停车场: { zh: "停车场", ja: "駐車場", en: "Parking" }, 图书馆: { zh: "图书馆", ja: "図書館", en: "Libraries" }, 学校: { zh: "学校", ja: "学校", en: "Schools" }, 医院: { zh: "医院", ja: "病院", en: "Hospitals" }, 住宅: { zh: "住宅", ja: "住宅", en: "Housing" },
};

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const numeric = (record: RawRecord, answer: string) => record.tags.includes("数值") || /\d+(?:[.,]\d+)?\s*(?:m|cm|mm|㎡|%|人|席|台|以下|以上|程度)|\d+\s*[/:]\s*\d+/i.test(answer);

export function getPlanningLibraryData() {
  const source = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "anki-import", "planning", "anki-notes.json"), "utf-8")) as { records: RawRecord[] };
  const imageMap = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "planning-card-image-map.json"), "utf-8")) as ImageMap;
  const seen = new Set<string>(); const items: PlanningLibraryItem[] = [];
  for (const record of source.records) {
    const prompt = clean(record.fields.image); const answer = clean(record.fields.style); const images = imageMap.notes[record.source.noteId] ?? [];
    if (!prompt || (!answer && !images.length)) continue;
    const key = `${prompt.normalize("NFKC")}\0${answer.normalize("NFKC")}\0${images.join("|")}`; if (seen.has(key)) continue; seen.add(key);
    const categoryKey = record.source.deck.split("::").at(-1) ?? "その他";
    items.push({ id: `planning-${record.source.noteId}`, prompt, answer, images, categoryKey, category: LABELS[categoryKey] ?? { zh: categoryKey, ja: categoryKey, en: categoryKey }, importance: record.tags.find((tag) => tag.startsWith("重要程度::"))?.split("::")[1] ?? "普通", numeric: numeric(record, answer), tags: record.tags.filter((tag) => !tag.startsWith("类型::") && tag !== "planning-card") });
  }
  return { items, excludedCount: source.records.length - items.length };
}

