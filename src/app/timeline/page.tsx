import { Suspense } from "react";
import fs from "fs";
import path from "path";
import TimelineClient from "./TimelineClient";

interface NormalizedBuilding {
  id: string;
  name: { ja: string; zh: string };
  period: { ja: string; zh: string };
  regions: string[];
  normalizedStyleNames?: string[];
  rawAnki?: { style?: string };
}

interface ImageAsset {
  fileName: string;
  originalName?: string;
}

// The normalized import retains this one legacy simplified-character spelling.
// Keep the timeline's Japanese UI canonical without relying on name matching.
const TIMELINE_BUILDING_NAME_OVERRIDES: Record<string, string> = {
  "building-c90fcc3d63b9": "平等院鳳凰堂",
};

const TIMELINE_BUILDING_ENGLISH_NAME_OVERRIDES: Record<string, string> = {
  "building-supplemental-higashi-sanjo-dono": "Higashi Sanjō Palace",
  "building-f13903fd9d85": "Kalenderhane Mosque",
  "building-e66d6c36d41d": "Sōfuku-ji Sanmon Gate",
  "building-e57f2f2374b2": "Manpuku-ji Daiōhōden",
  "building-eb725cff4f87": "Rinshunkaku",
  "building-9716abff0e95": "Jo-an Tea House",
  "building-a11d8e6f392f": "Taikyokuden",
  "building-7072d784e794": "Ishiyama-dera Tahōtō",
  "building-605c0863e4e1": "Eizan-ji Hakkakudō",
  "building-e0c362fd2907": "Tokyo Central Telegraph Office",
  "building-29692e316552": "Lake Biwa Canal Bridge",
  "building-exam-39a8f4cbeee6": "Laurentian Library",
  "building-supplemental-saint-denis": "Basilica of Saint-Denis",
  "building-supplemental-villa-tugendhat": "Villa Tugendhat",
  "building-supplemental-reims-cathedral": "Reims Cathedral",
  "building-supplemental-notre-dame-raincy": "Notre-Dame du Raincy",
  "building-supplemental-yamanashi-culture-hall": "Yamanashi Culture Hall",
  "building-supplemental-nageiredo": "Nageire-dō, Sanbutsu-ji",
  "building-supplemental-tokyo-station": "Tokyo Station Building",
  "building-supplemental-glasgow-school-art": "Glasgow School of Art",
  "building-supplemental-jiyu-gakuen": "Jiyu Gakuen Myonichikan",
};

function resolveComparisonRegion(regions: string[]): "western" | "japan" | "unassigned" {
  if (regions.includes("western")) return "western";
  if (regions.includes("japan") || regions.includes("east-asian")) return "japan";
  return "unassigned";
}

export default function TimelinePage() {
  const raw = fs.readFileSync(path.join(process.cwd(), "data/building-learning-card-links.json"), "utf-8");
  const data = JSON.parse(raw) as {
    buildings: {
      buildingId: string;
      buildingNameJa: string;
      learningCardIds: string[];
      examEvidence: unknown[];
    }[];
  };
  const normalizedRaw = fs.readFileSync(
    path.join(process.cwd(), "data/architecture-normalized-candidates.json"),
    "utf-8"
  );
  const normalized = JSON.parse(normalizedRaw) as { buildings: NormalizedBuilding[] };
  const normalizedById = new Map(normalized.buildings.map((building) => [building.id, building]));

  const imageRaw = fs.readFileSync(path.join(process.cwd(), "data/building-image-map.json"), "utf-8");
  const imageMap = JSON.parse(imageRaw) as Record<string, { imageFiles?: string[] }>;
  const imageAssetsRaw = fs.readFileSync(path.join(process.cwd(), "data/image-assets.json"), "utf-8");
  const imageAssets = (JSON.parse(imageAssetsRaw) as { assets: ImageAsset[] }).assets;

  const buildingLinks = data.buildings.map((building) => {
    const entity = normalizedById.get(building.buildingId);
    const candidateImageFile = imageMap[building.buildingId]?.imageFiles?.[0];
    const imageFile = candidateImageFile && (() => {
      const imagePath = path.join(process.cwd(), "public/architecture-images", candidateImageFile);
      return fs.existsSync(imagePath) && fs.statSync(imagePath).size > 0 ? candidateImageFile : null;
    })();
    const imageAsset = imageFile ? imageAssets.find((asset) => asset.fileName === imageFile && asset.originalName?.trim()) : undefined;
    return {
      id: building.buildingId,
      nameJa: TIMELINE_BUILDING_NAME_OVERRIDES[building.buildingId] ?? (entity?.name.ja || building.buildingNameJa),
      nameZh: entity?.name.zh || building.buildingNameJa,
      nameEn: TIMELINE_BUILDING_ENGLISH_NAME_OVERRIDES[building.buildingId] ?? imageAsset?.originalName?.trim() ?? building.buildingNameJa,
      cardIds: building.learningCardIds,
      examCount: building.examEvidence.length,
      region: resolveComparisonRegion(entity?.regions ?? []),
      period: entity?.period.ja ?? "",
      style: entity?.normalizedStyleNames?.[0] ?? entity?.rawAnki?.style ?? "",
      imageFile: imageFile ?? null,
    };
  });

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-sm text-gray-400">Loading timeline…</div>
        </div>
      }
    >
      <TimelineClient buildingLinks={buildingLinks} />
    </Suspense>
  );
}
