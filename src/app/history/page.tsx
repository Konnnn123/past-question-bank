import fs from "fs";
import path from "path";
import HistoryClient from "./HistoryClient";
import { getPastExamQuestionMeta, type PastExamQuestionMeta } from "@/lib/past-exam-question-meta";
import { getOriginalLanguageTerm } from "@/lib/original-language-terms";

interface BuildingLink {
  buildingId: string;
  buildingNameJa: string;
  buildingNameEn: string;
  learningCardIds: string[];
  examEvidence?: Omit<ExamEvidenceItem, "examTerm">[];
}

interface AnkiHistoryRecord {
  name?: string;
  fields?: {
    buildingName?: string;
    originalName?: string;
  };
}

interface NormalizedBuilding {
  id: string;
  aliases?: string[];
  regions?: string[];
}

const EXPLICIT_BUILDING_NAMES: Record<string, string> = {
  "building-urban-case-imaicho": "今井町",
  "building-urban-case-tondabayashi": "富田林寺内町",
  "building-urban-case-canberra": "Canberra Plan",
  "building-urban-case-brasilia": "Pilot Plan of Brasília",
  "building-urban-case-ringstrasse": "Vienna Ringstrasse",
  "building-urban-case-eixample": "Eixample, Barcelona",
  "building-core-mezquita": "Mezquita-Catedral de Córdoba",
};

interface ExamEvidenceItem {
  year: number;
  category: string;
  questionNumber: string;
  fileName: string;
  relation: string;
  examTerm: string;
}

export default function HistoryPage() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data/building-learning-card-links.json"),
    "utf-8"
  );
  const linksData = JSON.parse(raw);
  const ankiData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/anki-import/anki-notes.json"), "utf-8")
  ) as { records?: AnkiHistoryRecord[] };
  const normalizedData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/architecture-normalized-candidates.json"), "utf-8")
  ) as { buildings?: NormalizedBuilding[] };
  const originalNameByJapaneseName = new Map(
    (ankiData.records ?? [])
      .filter((record) => record.fields?.originalName?.trim())
      .map((record) => [record.fields?.buildingName ?? record.name ?? "", record.fields!.originalName!.trim()])
  );
  const normalizedBuildingById = new Map(
    (normalizedData.buildings ?? []).map((building) => [building.id, building])
  );
  const buildingLinks: BuildingLink[] = (linksData.buildings ?? []).map(
    (building: Omit<BuildingLink, "buildingNameEn">) => {
      const normalizedBuilding = normalizedBuildingById.get(building.buildingId);
      const sourceOriginalName = originalNameByJapaneseName.get(building.buildingNameJa);
      const buildingNameEn =
        normalizedBuilding?.regions?.includes("japan")
          ? building.buildingNameJa
          : sourceOriginalName ??
            getOriginalLanguageTerm(building.buildingNameJa)?.original ??
            normalizedBuilding?.aliases?.find((alias) => /[A-Za-z]/.test(alias)) ??
            EXPLICIT_BUILDING_NAMES[building.buildingId];

      if (!buildingNameEn) {
        throw new Error(`Missing English/original-language building name for ${building.buildingId}`);
      }

      return { ...building, buildingNameEn };
    }
  );

  // Load exam evidence mapping
  let cardExamEvidence: Record<string, ExamEvidenceItem[]> = {};
  const evidencePath = path.join(process.cwd(), "data/past-exam-card-evidence.json");
  if (fs.existsSync(evidencePath)) {
    const evRaw = fs.readFileSync(evidencePath, "utf-8");
    const evData = JSON.parse(evRaw);
    cardExamEvidence = evData.cardEvidence ?? {};
  }

  // A card can also be tested through one of its representative buildings.
  // Keep this traceable: it is shown as a building-derived link, rather than
  // being confused with a term printed directly in the question.
  for (const building of buildingLinks) {
    for (const cardId of building.learningCardIds) {
      const derived = (building.examEvidence ?? []).map((e) => ({
        ...e,
        relation: "related-building",
        examTerm: building.buildingNameJa,
      }));
      if (derived.length > 0) {
        cardExamEvidence[cardId] = [...(cardExamEvidence[cardId] ?? []), ...derived];
      }
    }
  }
  const evidenceFiles = Object.values(cardExamEvidence).flat().map((e) => e.fileName);
  const examQuestionMeta: Record<string, PastExamQuestionMeta> = getPastExamQuestionMeta(evidenceFiles);

  // Load building-image map (for thumbnails)
  const buildingImageMap: Record<string, string[]> = {};
  const imgMapPath = path.join(process.cwd(), "data/building-image-map.json");
  if (fs.existsSync(imgMapPath)) {
    const imgRaw = fs.readFileSync(imgMapPath, "utf-8");
    const imgData = JSON.parse(imgRaw);
    // Convert to simpler format: buildingId -> first image filename
    for (const [bid, info] of Object.entries(imgData) as [string, { imageFiles: string[] }][]) {
      if (info.imageFiles && info.imageFiles.length > 0) {
        buildingImageMap[bid] = info.imageFiles;
      }
    }
  }

  return (
    <HistoryClient
      buildingLinks={buildingLinks}
      cardExamEvidence={cardExamEvidence}
      examQuestionMeta={examQuestionMeta}
      buildingImageMap={buildingImageMap}
    />
  );
}
