import "server-only";
import fs from "fs";
import path from "path";
import type { ConstructionCardKind, ConstructionLibraryItem } from "./construction-library-types";

interface RawConstructionRecord {
  source: { noteId: string; deck: string };
  fields: {
    knowledgePoint: string;
    category: string;
    backHtml: string;
    examForm: string;
    pastQuestion: string;
    sourceUrl: string;
  };
  tags: string[];
}

interface ConstructionImageMap {
  notesBySourceUrl: Record<string, string[]>;
  notesByTitle: Record<string, string[]>;
}

const ENTITY_MAP: Record<string, string> = { "&nbsp;": " ", "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&#39;": "'" };
const clean = (value: string) => value.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&(nbsp|amp|lt|gt|quot|#39);/g, (entity) => ENTITY_MAP[entity] ?? entity).replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();

const japaneseImportText = (value: string) => value
  .replaceAll("墙体型枠内侧的间隔保持部材。", "壁型枠内側の間隔を保持する部材。")
  .replaceAll("图解识别", "図解識別")
  .replaceAll("用语填空", "用語穴埋め")
  .replaceAll("案例分析", "事例分析")
  .replaceAll("比较说明", "比較説明")
  .replaceAll("施工手顺", "施工手順")
  .replaceAll("选择题", "選択問題")
  .replaceAll("论述", "論述")
  .replaceAll("简答", "短答");

function overview(value: string) {
  const text = clean(value);
  const explicit = text.match(/(?:📝\s*)?(?:简介|概要)\s+([\s\S]*?)(?=\s*[📋📖🏷]|$)/)?.[1]?.trim();
  if (explicit) return japaneseImportText(explicit);
  return japaneseImportText(text.replace(/[📋📖🏷][\s\S]*$/, "").trim());
}

function normalizeKind(value: string): { kind: ConstructionCardKind; label: string } {
  const normalized = value.normalize("NFKC").trim();
  if (/概念/.test(normalized)) return { kind: "concept", label: "概念" };
  if (/工法|工艺|工程/.test(normalized)) return { kind: "method", label: "工法・工程" };
  if (/部材/.test(normalized)) return { kind: "component", label: "部材" };
  if (/材料/.test(normalized)) return { kind: "material", label: "材料" };
  if (/构法|组装|組立|構法/.test(normalized)) return { kind: "assembly", label: "構法・組立" };
  if (/数値/.test(normalized)) return { kind: "value", label: "数値" };
  return { kind: "other", label: normalized || "その他" };
}

export function getConstructionLibraryData() {
  const source = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "anki-import", "construction-anki-notes.json"), "utf-8")) as { records: RawConstructionRecord[] };
  const imageMap = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "construction-card-image-map.json"), "utf-8")) as ConstructionImageMap;
  const seen = new Set<string>();
  const items: ConstructionLibraryItem[] = [];

  for (const record of source.records) {
    const title = clean(record.fields.knowledgePoint);
    if (!title) continue;
    const key = `${record.fields.sourceUrl}\0${title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const { kind, label } = normalizeKind(record.fields.category);
    items.push({
      id: `construction-${record.source.noteId}`,
      title,
      explanation: overview(record.fields.backHtml),
      images: imageMap.notesBySourceUrl[record.fields.sourceUrl] ?? imageMap.notesByTitle[title] ?? [],
      system: record.source.deck.split("::").at(-1) ?? "共通構法",
      kind,
      kindLabel: label,
      examForms: japaneseImportText(clean(record.fields.examForm)).split(/[、,，・/]/).map((item) => item.trim()).filter(Boolean),
      pastQuestion: clean(record.fields.pastQuestion),
      sourceUrl: record.fields.sourceUrl,
      tags: record.tags,
    });
  }

  return { items, excludedCount: source.records.length - items.length };
}
