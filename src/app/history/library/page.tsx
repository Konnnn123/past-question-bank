import fs from "fs";
import path from "path";
import { Suspense } from "react";
import { HISTORY_LEARNING_CARDS } from "@/lib/history-learning-cards";
import { getBuildingChronology } from "@/lib/japanese-building-chronology";
import { getOriginalLanguageTerm } from "@/lib/original-language-terms";
import HistoryLibraryClient, {
  type HistoryLibraryItem,
  type HistoryQuizBuilding,
  type LibraryCopy,
} from "./HistoryLibraryClient";

interface NormalizedBuilding {
  id: string;
  name: { ja: string; zh: string };
  aliases: string[];
  period: { ja: string; zh: string };
  history: { ja: string; zh: string };
  regions: string[];
  typeIds: string[];
  normalizedStyleNames?: string[];
  normalizedPersonNames?: string[];
  examEvidence: unknown[];
  priorityLevel?: "S" | "A" | "B" | "normal";
}

interface BuildingLink {
  buildingId: string;
  buildingNameJa: string;
  learningCardIds: string[];
  examEvidence?: unknown[];
}

interface ImageAsset {
  fileName: string;
  originalName?: string;
}

type RuntimeLocalized = { ja: string; zh: string; en?: string };

function copy(value: RuntimeLocalized, context: string): LibraryCopy {
  if (!value.en?.trim()) throw new Error(`Missing English history-library text: ${context}`);
  return { ja: value.ja, zh: value.zh, en: value.en };
}

function validImageFile(imageMap: Record<string, { imageFiles?: string[] }>, buildingId: string) {
  const file = imageMap[buildingId]?.imageFiles?.[0];
  if (!file) return null;
  const target = path.join(process.cwd(), "public", "architecture-images", file);
  return fs.existsSync(target) && fs.statSync(target).size > 0 ? file : null;
}

export default function HistoryLibraryPage() {
  const links = (JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "building-learning-card-links.json"), "utf-8")) as { buildings: BuildingLink[] }).buildings;
  const normalized = (JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "architecture-normalized-candidates.json"), "utf-8")) as { buildings: NormalizedBuilding[] }).buildings;
  const imageMap = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "building-image-map.json"), "utf-8")) as Record<string, { imageFiles?: string[] }>;
  const imageAssets = (JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "image-assets.json"), "utf-8")) as { assets: ImageAsset[] }).assets;

  const normalizedById = new Map(normalized.map((building) => [building.id, building]));
  const linkById = new Map(links.map((building) => [building.buildingId, building]));
  const assetByFile = new Map(imageAssets.filter((asset) => asset.originalName?.trim()).map((asset) => [asset.fileName, asset.originalName!.trim()]));

  const displayName = (building: BuildingLink, imageFile: string) => {
    const entity = normalizedById.get(building.buildingId);
    if (entity?.regions.includes("japan")) return building.buildingNameJa;
    return assetByFile.get(imageFile)
      ?? getOriginalLanguageTerm(building.buildingNameJa)?.original
      ?? entity?.aliases?.find((alias) => /[A-Za-z]/.test(alias))
      ?? building.buildingNameJa;
  };

  const approximateYear = (period: string) => {
    const exact = period.match(/(?:紀元前|前)?\s*(\d{3,4})年/);
    if (exact) return period.includes("紀元前") || period.startsWith("前") ? -Number(exact[1]) : Number(exact[1]);
    const century = period.match(/(\d{1,2})世紀/);
    if (century) {
      const value = Number(century[1]);
      if (period.includes("紀元前")) return -(value * 100 - 50);
      const offset = period.includes("初頭") ? 10 : period.includes("前半") ? 25 : period.includes("後半") ? 75 : period.includes("末") ? 90 : 50;
      return (value - 1) * 100 + offset;
    }
    const eras: [string, number][] = [
      ["縄文", -10000], ["弥生", -300], ["古墳", 250], ["飛鳥", 592], ["奈良", 710], ["平安", 794],
      ["鎌倉", 1185], ["室町", 1336], ["安土桃山", 1573], ["桃山", 1573], ["江戸", 1603],
      ["明治", 1868], ["大正", 1912], ["昭和", 1926], ["平成", 1989], ["令和", 2019],
      ["古代ギリシア", -500], ["ローマ", 27], ["初期キリスト教", 250], ["ビザンティン", 330],
      ["カロリング", 750], ["ロマネスク", 1050], ["ゴシック", 1200], ["ルネサンス", 1450],
      ["バロック", 1650], ["ヴィクトリア", 1850], ["近代", 1900], ["現代", 2000],
    ];
    return eras.find(([label]) => period.includes(label))?.[1] ?? null;
  };

  const items: HistoryLibraryItem[] = normalized.map((building) => {
    const link = linkById.get(building.id);
    const imageFile = validImageFile(imageMap, building.id);
    const canonicalJa = link?.buildingNameJa || building.name.ja;
    const originalName = imageFile
      ? displayName(link ?? { buildingId: building.id, buildingNameJa: canonicalJa, learningCardIds: [] }, imageFile)
      : building.regions.includes("japan")
        ? canonicalJa
        : getOriginalLanguageTerm(canonicalJa)?.original
          ?? building.aliases.find((alias) => /[A-Za-z]/.test(alias))
          ?? canonicalJa;
    const chronologyJa = getBuildingChronology(building, "ja");
    const chronologyZh = getBuildingChronology(building, "zh");
    const relatedCards = (link?.learningCardIds ?? []).flatMap((id) => {
      const card = HISTORY_LEARNING_CARDS.find((candidate) => candidate.id === id);
      return card ? [{ id: card.id, name: copy(card.name as RuntimeLocalized, `${card.id}.name`) }] : [];
    });
    return {
      id: building.id,
      name: { ja: canonicalJa, zh: building.name.zh || originalName, en: originalName },
      aliases: building.aliases,
      period: { ja: building.period.ja, zh: building.period.zh || building.period.ja, en: building.period.ja },
      chronology: chronologyJa && chronologyZh ? { ja: chronologyJa, zh: chronologyZh, en: chronologyJa.replace("時代範囲：", "Era range: ") } : null,
      regions: building.regions,
      typeIds: building.typeIds,
      styles: building.normalizedStyleNames?.filter((value) => value !== "要確認") ?? [],
      people: building.normalizedPersonNames?.filter((value) => value !== "要確認") ?? [],
      sortYear: approximateYear(building.period.ja),
      examCount: building.examEvidence.length,
      priority: building.priorityLevel ?? "normal",
      relatedCards,
      image: imageFile ? { file: imageFile } : null,
      href: `/history/buildings/${building.id}`,
    };
  });

  const quizBuildings: HistoryQuizBuilding[] = links.flatMap((building) => {
    const entity = normalizedById.get(building.buildingId);
    const imageFile = validImageFile(imageMap, building.buildingId);
    if (!entity || !imageFile) return [];
    const relatedCards = building.learningCardIds.flatMap((id) => {
      const card = HISTORY_LEARNING_CARDS.find((candidate) => candidate.id === id);
      return card ? [{ id: card.id, name: copy(card.name as RuntimeLocalized, `${card.id}.name`) }] : [];
    });
    const chronologyJa = getBuildingChronology(entity, "ja");
    const chronologyZh = getBuildingChronology(entity, "zh");
    return [{
      id: building.buildingId,
      name: displayName(building, imageFile),
      nameJa: building.buildingNameJa,
      imageFile,
      period: { ja: entity.period.ja, zh: entity.period.zh || entity.period.ja, en: entity.period.ja },
      chronology: chronologyJa && chronologyZh ? { ja: chronologyJa, zh: chronologyZh, en: chronologyJa.replace("時代範囲：", "Era range: ") } : null,
      sortYear: approximateYear(entity.period.ja),
      architects: entity.normalizedPersonNames?.filter((value) => value !== "要確認") ?? [],
      regions: entity.regions,
      relatedCards,
      href: `/history/buildings/${building.buildingId}`,
    }];
  });

  return <Suspense fallback={<div className="min-h-screen bg-[#f5f4ef]" />}><HistoryLibraryClient items={items} quizBuildings={quizBuildings} /></Suspense>;
}
